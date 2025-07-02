import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
    password = '';
    errorMessage = '';
    isLoading = false;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    async onSubmit(): Promise<void> {
        if (!this.password.trim()) {
            this.errorMessage = 'Password is required';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        try {
            const isAuthenticated = await this.authService.login(this.password);
            
            if (isAuthenticated) {
                this.router.navigate(['/admin-dashboard']);
            } else {
                this.errorMessage = 'Invalid password. Please try again.';
            }
        } catch (error) {
            this.errorMessage = 'Authentication failed. Please try again.';
            console.error('Login error:', error);
        } finally {
            this.isLoading = false;
            this.password = '';
        }
    }

    onPasswordInput(): void {
        if (this.errorMessage) {
            this.errorMessage = '';
        }
    }
}
