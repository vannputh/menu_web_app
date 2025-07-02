# MongoDB Atlas Setup Guide

## Migration from MongoDB Compass to MongoDB Atlas

Your backend is now configured to work with MongoDB Atlas (cloud) instead of MongoDB Compass (local). Follow these steps to complete the setup:

## 🚀 Quick Setup

1. **Copy the environment template:**
   ```bash
   cp env-template.txt .env
   ```

2. **Edit the `.env` file** with your actual credentials (see detailed steps below)

3. **Start your server:**
   ```bash
   npm start
   ```

## 📋 Detailed Steps

### 1. Create MongoDB Atlas Account & Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for a free account
3. Create a new cluster (M0 free tier is perfect for development)
4. Wait for the cluster to be created (2-3 minutes)

### 2. Set Up Database Access

1. In Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create a username and password (remember these!)
5. Set privileges to **Read and write to any database**
6. Click **Add User**

### 3. Set Up Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. For development, click **Allow Access from Anywhere** (0.0.0.0/0)
   - For production, restrict to specific IPs
4. Click **Confirm**

### 4. Get Connection String

1. Go to **Clusters**
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password

### 5. Configure Environment Variables

1. Copy `env-template.txt` to `.env`:
   ```bash
   cp env-template.txt .env
   ```

2. Edit `.env` and replace the placeholders:
   ```env
   MONGO_URI=mongodb+srv://your-actual-username:your-actual-password@your-cluster.xxxxx.mongodb.net/menu-web-app?retryWrites=true&w=majority
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_APP_PASSWORD=your-16-char-app-password
   ADMIN_PASSWORD=your-secure-admin-password
   PORT=3000
   NODE_ENV=development
   ```

### 6. Gmail Setup (for order emails)

1. Enable 2-Step Verification on your Google Account
2. Go to Google Account Settings → Security → App passwords
3. Generate a new app password for "Mail"
4. Use this 16-character password in `EMAIL_APP_PASSWORD`

### 7. Admin Dashboard Setup

1. Set a secure password for `ADMIN_PASSWORD` in your `.env` file
2. This password will be used to access the admin dashboard at `/admin`
3. Choose a strong password that's different from your other credentials
4. The password is verified server-side for security

## 🔧 What Changed

- **Connection**: Now connects to MongoDB Atlas cloud database
- **Configuration**: Added Atlas-optimized connection options
- **Environment**: All credentials now in environment variables
- **Security**: .env file is gitignored for security
- **Admin Auth**: Admin password now stored securely in backend .env file
- **API Endpoint**: Added `/admin/login` endpoint for secure authentication

## ✅ Verify Connection

Start your server and look for:
```
Connected to MongoDB Atlas
Server running on port 3000
```

## 🔒 Security Notes

- Never commit `.env` file to git (already in .gitignore)
- Use strong passwords for database users
- Restrict network access in production
- Use separate clusters for development and production

## 🆘 Troubleshooting

**Connection Failed?**
- Check if your IP is whitelisted in Network Access
- Verify username/password in connection string
- Ensure cluster is running (not paused)

**Email Not Working?**
- Make sure 2-Step Verification is enabled
- Use App Password, not regular Gmail password
- Check Gmail security settings

## 📚 Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Atlas Connection Guide](https://mongoosejs.com/docs/connections.html#atlas)
- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833) 