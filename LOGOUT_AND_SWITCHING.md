# Logout & Account Switching Guide

## CHIKITSA DESK - Session Management Features

This guide explains how to use the logout and account switching features in CHIKITSA DESK.

---

## Header Navigation Overview

### What You'll See in the Header

The top of every page (except login/signup) shows:

```
┌─────────────────────────────────────────────────────────────────┐
│  [CHIKITSA DESK Logo]    Healthcare Management       [Name ▼]  │
│                                                    [Role Info]   │
└─────────────────────────────────────────────────────────────────┘
```

- **Left**: CHIKITSA DESK branding with icon
- **Right**: Your profile button with dropdown arrow

---

## Feature #1: Logout

### What is Logout?
Logout ends your current session and returns you to the login page. All your session data is cleared, and you'll need to login again to access your account.

### How to Logout

**Step 1: Click Your Profile**
- Look at the top-right corner
- Click on your name and role
- A dropdown menu appears

**Step 2: Click Logout**
- Look for the red "Logout" button at the bottom of the menu
- Click it

**Step 3: Confirmation**
- You'll be redirected to the login page
- Your session is cleared
- You're fully logged out

### What Happens When You Logout
- ✅ All session data is cleared
- ✅ Current user is removed from memory
- ✅ You're redirected to login page
- ✅ Browser session ends
- ✅ Your data remains safe in storage

### When to Logout
- Before closing your browser
- When using a shared device
- After finishing your work
- For security purposes
- When switching to another user

---

## Feature #2: Account Switching

### What is Account Switching?
Account switching allows you to quickly switch between multiple user accounts without fully logging out. Perfect for testing different roles or managing multiple accounts.

### How to Switch Accounts

**Step 1: Open Profile Menu**
- Click on your profile in the top-right
- The dropdown menu opens
- You'll see your current account info at the top

**Step 2: View Available Accounts**
- Look for "SWITCH ACCOUNT" section
- You'll see a list of other available accounts
- Each shows the name and role

**Step 3: Click Another Account**
- Click on the account you want to switch to
- The system instantly switches to that account
- The dropdown closes automatically

**Step 4: New Dashboard Loads**
- You're redirected to the appropriate dashboard
- Dashboard updates based on new role
- All features are available for the new account
- Header shows new account name and role

### Example Account Switching

```
You're logged in as: John Doe (Patient)

Header shows:
┌──────────────────────────┐
│ John Doe                 │
│ Patient              ▼   │
└──────────────────────────┘

Click to open menu:
┌──────────────────────────────────┐
│ Logged in as                     │
│ John Doe                         │
│ Patient                          │
├──────────────────────────────────┤
│ SWITCH ACCOUNT                   │
│ • Dr. Michael Smith (Doctor)     │
│ • Dr. Sarah Johnson (Doctor)     │
│ • Dr. Emily Williams (Doctor)    │
├──────────────────────────────────┤
│ [Logout Button]                  │
└──────────────────────────────────┘

Click "Dr. Michael Smith (Doctor)":
✓ Instantly switched to doctor account
✓ Redirected to doctor dashboard
✓ Header now shows "Dr. Michael Smith - Doctor"
✓ All doctor features now available
```

### Available Demo Accounts for Switching

**Patient Account:**
- Name: John Doe
- Role: Patient
- Email: john.doe@email.com
- Access: Patient features, appointments, medical records

**Doctor Accounts:**
1. Dr. Michael Smith (General Medicine)
   - Email: dr.smith@smartclinic.com
   - Rating: 4.8/5

2. Dr. Sarah Johnson (Cardiology)
   - Email: dr.johnson@smartclinic.com
   - Rating: 4.9/5

3. Dr. Emily Williams (Dermatology)
   - Email: dr.williams@smartclinic.com
   - Rating: 4.7/5

---

## Header Menu Structure

When you click your profile, the dropdown shows:

```
┌─────────────────────────────────────┐
│  CURRENT ACCOUNT SECTION            │
│  ───────────────────────────────    │
│  Your Name                          │
│  Your Role (Patient/Doctor)         │
├─────────────────────────────────────┤
│  SWITCH ACCOUNT (if available)      │
│  ───────────────────────────────    │
│  • Account Name 1 (Role)            │
│  • Account Name 2 (Role)            │
│  • Account Name 3 (Role)            │
├─────────────────────────────────────┤
│  [RED LOGOUT BUTTON]                │
└─────────────────────────────────────┘
```

---

## Visual Indicators

### Header States

**When Not Logged In:**
- Header is hidden
- Only on login/signup pages

**When Logged In (Patient):**
```
┌─────────────────────────────────────┐
│ [CD] CHIKITSA DESK    John Doe ▼    │
│      Healthcare       Patient        │
└─────────────────────────────────────┘
```

**When Logged In (Doctor):**
```
┌─────────────────────────────────────┐
│ [CD] CHIKITSA DESK    Dr. Smith ▼   │
│      Healthcare       Doctor         │
└─────────────────────────────────────┘
```

**Menu Open State:**
```
┌─────────────────────────────────────┐
│ [CD] CHIKITSA DESK    Dr. Smith ▲   │
│      Healthcare       Doctor         │
└─────────────────────────────────────┘
        ↓ (Menu visible below)
┌─────────────────────────────────────┐
│ Logged in as                        │
│ Dr. Michael Smith                  │
│ Doctor                             │
├─────────────────────────────────────┤
│ SWITCH ACCOUNT                      │
│ • John Doe (Patient)               │
├─────────────────────────────────────┤
│ [Logout]                            │
└─────────────────────────────────────┘
```

---

## Quick Reference

### Keyboard Navigation
- Click profile dropdown to open
- Click account to switch
- Click logout to exit

### Mobile View
- Header is responsive
- Works on all screen sizes
- Touch-friendly buttons
- Easy to tap profile menu

### Desktop View
- Sticky header at top
- Always accessible
- Smooth animations
- Professional appearance

---

## Common Scenarios

### Scenario 1: Testing Patient Features
1. Login as: john.doe@email.com (Patient)
2. Explore patient features
3. Click profile in header
4. Switch to doctor account
5. Explore doctor features
6. Switch back to patient

### Scenario 2: Secure Logout
1. Finish your work
2. Click profile in header
3. Click Logout button
4. You're redirected to login
5. Completely logged out
6. Can login with different account

### Scenario 3: Quick Account Review
1. Login as Patient
2. Click profile
3. Switch to Doctor 1
4. Click profile
5. Switch to Doctor 2
6. Click profile
7. Switch back to Patient

---

## Troubleshooting

### Dropdown Not Opening
- Check that you're logged in
- Not on login/signup page
- Try clicking profile again
- Refresh page if needed

### Can't Switch Accounts
- Verify other accounts exist
- Check account roles
- Try logout and login instead
- Refresh browser

### Logout Not Working
- Check your internet connection
- Browser may need refresh
- Clear browser cache
- Try incognito mode

### Header Not Visible
- Make sure you're logged in
- You're not on login/signup pages
- Try navigating to dashboard
- Refresh the page

---

## Security Best Practices

### Safe Logout
✅ Always logout before closing browser
✅ Logout on shared devices
✅ Logout before leaving your desk
✅ Use logout instead of closing tab
✅ Clear browser history if needed

### Account Switching
✅ Only switch between your accounts
✅ Don't share login credentials
✅ Logout before giving device to others
✅ Use account switching for testing only
✅ Keep passwords secure

### Session Management
✅ One active session per account
✅ Logging in elsewhere logs you out
✅ Session data is stored securely
✅ Use HTTPS (in production)
✅ Keep browser updated

---

## Tips & Tricks

### Quick Actions
- **Fastest Logout**: Click profile → Click Logout
- **Quick Switch**: Click profile → Click account name
- **Save Time**: Keep frequently used accounts

### Efficiency
- Switch accounts without full reload
- Stay in same location in app
- Quickly test different roles
- Easy account comparison

### Best Experience
- Use logout for security
- Use switching for efficiency
- Keep accounts organized
- Log important activities

---

## FAQ

### Q: Does switching accounts clear my data?
A: No, all your data is preserved. You're just viewing a different account.

### Q: Is account switching secure?
A: Yes, each account is independently secured with your session.

### Q: What happens to unsaved changes when I logout?
A: Unsaved changes are lost. Always save before logout.

### Q: Can I have multiple sessions?
A: No, only one active session per account.

### Q: Is my data safe after logout?
A: Yes, your data remains stored securely.

### Q: How do I switch back to previous account?
A: Click profile → Click the account you want → Instant switch

### Q: What if I forget to logout?
A: Your session will expire after browser closes (demo mode).

### Q: Can I logout from mobile?
A: Yes, header works on all devices.

---

## Visual Workflow

### Complete User Flow

```
Start
  ↓
Login Page
  ↓ (Enter credentials)
Dashboard (Your Role)
  ↓
Click Profile → Dropdown Opens
  ├─ Switch Account → New Dashboard
  │  ├─ Work
  │  ├─ Click Profile
  │  └─ Switch Back
  │
  └─ Logout → Login Page
```

---

## Summary

**Header Features:**
1. Profile display (top right)
2. Dropdown menu (click to open)
3. Account switching (instant role change)
4. Secure logout (ends session)

**Benefits:**
- Easy account management
- Quick role switching
- Secure logout
- One-click operations
- Professional interface

**Best For:**
- Testing different roles
- Managing multiple accounts
- Secure session ending
- Quick navigation

---

**Last Updated**: March 2026
**Version**: 3.0
**Platform**: CHIKITSA DESK Healthcare Management System
