import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from './cart.service';
import { CartItem } from '../shared/interfaces/cart-item.interface';
import { CartItemComponent } from '../shared/components/cart-item/cart-item.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { jsPDF } from 'jspdf';
import { FormsModule } from '@angular/forms';
import QRCode from 'qrcode-generator';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, CartItemComponent, DialogModule, ButtonModule, FormsModule],
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total: number = 0;
  paymentMethod: 'cash' | 'khqr' = 'cash';
  qrCodeUrl: string = '';
  errorMessage: string = '';

  // Dialog visibility flags
  receiptDialogVisible = false;
  finalConfirmationDialogVisible = false;
  emailDialogVisible = false;

  private specialInstructions: string | undefined;
  customerName: any;
  soupTypeNames: { [key: string]: string } = {
    sichuan_spicy: 'Sichuan Spicy Broth',
    chongqing_spicy: 'Chongqing Spicy Broth',
    milky_broth: 'Milky Mala Broth',
    tomato: 'Tomato Broth',
    wild_mushroom: 'Wild Mushroom Broth'
  };
  customerEmail: string = '';
  private orderId: any;

  constructor(protected cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.items = items;
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      }
    });

    // Generate QR Code for payment
    this.generateQRCode();
  }

  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(index: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(index, quantity);
    }
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

  async sendReceiptEmail() {
    if (!this.customerEmail) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      // Generate PDF blob
      const pdfBlob = this.generatePDF();

      const formData = new FormData();
      formData.append('pdf', pdfBlob, 'receipt.pdf');
      formData.append('customerName', this.customerName);
      formData.append('customerEmail', this.customerEmail);

      const response = await fetch('http://localhost:3000/api/send-order-email', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email');
      }

      const data = await response.json();
      console.log('Email sent successfully:', data);
      this.emailDialogVisible = false;
      this.cartService.clearCart();
      alert('Receipt has been sent to your email!');

    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    }
  }

  checkout() {
    if (this.items.length === 0) {
      return;
    }
    this.receiptDialogVisible = true;
  }

  generateQRCode() {
    try {
      const paymentUrl = 'https://pay.ababank.com/bVH6Ad2ZPvdhGdJd8';
      const qr = QRCode(0, 'H');
      qr.addData(paymentUrl);
      qr.make();
      this.qrCodeUrl = qr.createDataURL(8);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }

  generatePDF(): Blob {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // Header
    doc.setFontSize(20);
    doc.setTextColor(220, 20, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('KaiXin Official Receipt', 105, 25, { align: 'center' });

    // Customer Name Header
    doc.setFontSize(14);
    doc.setTextColor(220, 20, 60);
    doc.text(`Customer Name: ${this.customerName}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 50);

    // Table Headers
    doc.setFontSize(10);
    doc.setTextColor(220, 20, 60);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Item', 20, 60);
    doc.text('Quantity', 80, 60);
    doc.text('Price', 120, 60);
    doc.text('Subtotal', 160, 60);

    // Separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 65, 190, 65);

    // Order Items
    doc.setFont('helvetica', 'normal');
    let yOffset = 75;
    this.items.forEach((item) => {
      const subtotal = item.quantity * item.price;

      // Additional details
      const specialInstructions = item.specialInstructions ? `Note: ${item.specialInstructions}` : '';
      const iceLevel = item.iceLevel ? `Ice: ${item.iceLevel}` : '';
      const spiceLevel = item.spiceLevel ? `Spice: ${item.spiceLevel}` : '';
      const iced = item.iced ? 'Iced' : '';
      const toppings = item.topping ? `Toppings: ${item.topping}` : '';
      const soupType = item.soupType ? `Soup Type: ${this.soupTypeNames[item.soupType]}` : '';

      doc.setTextColor(0, 0, 0);
      doc.text(item.title, 20, yOffset);
      doc.text(item.quantity.toString(), 80, yOffset);
      doc.text(`$${item.price.toFixed(2)}`, 120, yOffset);
      doc.text(`$${subtotal.toFixed(2)}`, 160, yOffset);

      // Additional item details on next line
      if (this.specialInstructions || iceLevel || spiceLevel) {
        yOffset += 6;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text([specialInstructions, iceLevel, spiceLevel, iced, toppings, soupType].filter(Boolean).join(' | '), 20, yOffset);
        doc.setFontSize(10);
      }

      yOffset += 10;
    });

    // Total
    doc.setLineWidth(0.5);
    doc.line(20, yOffset, 190, yOffset);
    yOffset += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Total: $${this.total.toFixed(2)}`, 160, yOffset);

    return doc.output('blob');
  }

  downloadReceipt() {
    const pdfBlob = this.generatePDF();
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'receipt.pdf';
    link.click();
    URL.revokeObjectURL(url);
  }

  confirmOrder() {
    if (!this.customerName.trim()) {
      this.errorMessage = 'Please enter your name';
      return;
    }
    this.receiptDialogVisible = false;
    this.finalConfirmationDialogVisible = true;
  }

  sendEmail() {
    this.finalConfirmationDialogVisible = false;
    this.emailDialogVisible = true;
  }

  clearCart() {
    this.cartService.clearCart();
    this.finalConfirmationDialogVisible = false;
  }

  closeReceiptDialog() {
    this.receiptDialogVisible = false;
    this.errorMessage = '';
  }

  closeFinalConfirmationDialog() {
    this.finalConfirmationDialogVisible = false;
  }

  closeEmailDialog() {
    this.emailDialogVisible = false;
  }

  setPaymentMethod(method: 'cash' | 'khqr') {
    this.paymentMethod = method;
    this.errorMessage = '';
  }
}
