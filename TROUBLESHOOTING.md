# Smart Clinic - Troubleshooting Guide

## Getting Started

### Problem: "Cannot find module" errors
**Solution:**
1. Clear `.next` folder: `rm -rf .next`
2. Clear `node_modules`: `rm -rf node_modules`
3. Reinstall: `npm install` or `pnpm install`
4. Restart dev server

### Problem: Page not found (404)
**Solution:**
1. Make sure you're logged in
2. Check browser console for routing errors
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try refreshing the page

### Problem: Blank white screen
**Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Make sure JavaScript is enabled
4. Try a different browser

---

## Authentication Issues

### Problem: Cannot login
**Checklist:**
- ✅ Using correct email? (john.doe@email.com for patient)
- ✅ JavaScript enabled in browser?
- ✅ localStorage enabled?
- ✅ Not in private/incognito mode? (localStorage limited)

**Solutions:**
1. **Forgot email?** Use demo accounts:
   - Patient: `john.doe@email.com`
   - Doctor: `dr.smith@smartclinic.com`

2. **Still can't login?**
   - Try signing up with new email
   - Clear browser cache and cookies
   - Try a different browser

### Problem: Session lost after refresh
**Reason:** localStorage data not persisting
**Solution:**
1. Check if browser allows localStorage
2. Disable browser extensions
3. Try different browser
4. Check browser storage quota

### Problem: Can't sign up
**Checklist:**
- ✅ Email not already registered?
- ✅ All required fields filled?
- ✅ Password matches confirmation?
- ✅ Valid email format?

**Solution:**
- Check browser console for validation errors
- Try with different email address
- Clear cache and try again

---

## Appointment Issues

### Problem: Can't book appointment
**Troubleshooting:**
1. Are you logged in as PATIENT?
   - Go to `/patient/dashboard`
   - If redirected to doctor dashboard, you're logged in as doctor

2. Appointment requirements:
   - ✅ Doctor selected
   - ✅ Future date selected (today or later)
   - ✅ Valid time (9 AM to 5 PM)
   - ✅ Time slot not already booked

3. Try different time slot:
   - Pick morning time (9:00, 9:30)
   - Different day

### Problem: Booked appointment not showing
**Solutions:**
1. Refresh page (Ctrl+R or Cmd+R)
2. Go to patient dashboard
3. Check "All Appointments" page
4. Check browser's localStorage isn't full

### Problem: Can't cancel appointment
**Solution:**
- Only cancelable if status is "scheduled"
- Once cancelled, can't undo
- Confirm dialog must be accepted

### Problem: Can't complete appointment (Doctor)
**Solution:**
- Log in as doctor
- Go to `/doctor/schedule`
- Click appointment
- Click "Mark as Completed"

---

## Data & Storage Issues

### Problem: Data disappeared after closing browser
**Reason:** localStorage cleared or disabled
**Solution:**
1. Enable localStorage in browser settings
2. Disable private/incognito mode
3. Check browser storage quota
4. Try different browser

### Problem: Duplicate appointments appear
**Solution:**
1. This shouldn't happen - it's a bug
2. Clear browser cache and refresh
3. Report the issue

### Problem: Medical records not showing
**Solution:**
- Medical records are empty by default
- Only shown if doctor added them
- Check in `/patient/medical-records`

### Problem: Prescriptions not visible
**Solution:**
- Prescriptions created after appointments
- Ask doctor to add prescriptions
- Check recent appointments first

---

## Notification Issues

### Problem: No notifications
**Reason:** Notifications are created on specific events
**Solution:**
- Create a new appointment
- Get a review from patient
- Change appointment status
- Then check `/notifications`

### Problem: Can't clear notifications
**Solution:**
- Mark as read (not delete)
- Refresh page to see updated status
- Notifications persist in localStorage

---

## Review & Rating Issues

### Problem: Can't leave review
**Checklist:**
- ✅ Logged in as PATIENT?
- ✅ Completed appointment with this doctor?
- ✅ Selected rating (1-5 stars)?
- ✅ Added comment text?

### Problem: Doctor rating not updating
**Solution:**
1. Refresh page
2. Go to doctor profile
3. Rating should show updated average
4. Check if review was saved

### Problem: Can't see doctor reviews
**Solution:**
1. Go to "Find Doctors"
2. Click doctor card
3. Click "View Reviews"
4. Or go to specific doctor's review page

---

## Doctor Schedule Issues

### Problem: Can't view schedule
**Solution:**
- Must be logged in as DOCTOR
- Go to `/doctor/schedule`
- Select date in calendar

### Problem: Appointment not in schedule
**Reason:** Wrong date selected or appointment cancelled
**Solution:**
1. Check correct week/date
2. Filter by appointment status
3. Scroll down to see all appointments

### Problem: Can't update appointment status
**Solution:**
1. Click appointment details
2. Select new status
3. Confirm action
4. Refresh to see update

---

## UI & Display Issues

### Problem: Buttons not responsive
**Solution:**
1. Refresh page
2. Clear browser cache
3. Zoom to 100%
4. Try different browser

### Problem: Text overlapping or cut off
**Solution:**
1. Adjust browser zoom (100%)
2. Maximize browser window
3. Try different screen size
4. Try different browser

### Problem: Slow page loading
**Solution:**
1. Check internet connection
2. Close other browser tabs
3. Disable browser extensions
4. Clear browser cache

### Problem: Images not loading
**Solution:**
- Some images are generated
- Make sure internet connection is active
- Wait a moment for images to load
- Refresh if needed

---

## Advanced Troubleshooting

### Check Browser Console
1. Open DevTools (F12 or Ctrl+Shift+I)
2. Click "Console" tab
3. Look for red error messages
4. Copy error message to troubleshoot

### Check localStorage
1. Open DevTools (F12)
2. Click "Application" or "Storage"
3. Click "localStorage"
4. Check current domain
5. Look for `clinic_*` keys

### Check Network
1. Open DevTools (F12)
2. Click "Network" tab
3. Reload page
4. Look for failed requests
5. Check response status codes

### Browser Settings Required
- ✅ JavaScript enabled
- ✅ localStorage enabled
- ✅ Cookies enabled
- ✅ Not in private/incognito mode

---

## Common Error Messages

### "User not found"
- Email not registered
- Try demo account
- Try signing up first

### "This time slot is already booked"
- Time already taken
- Select different time
- Try different date

### "Passwords do not match"
- Password confirmation incorrect
- Retype password carefully
- Check caps lock

### "Email already registered"
- Email already has account
- Use different email
- Try logging in instead

### "Please fill in all required fields"
- Missing required information
- Fill all fields with *
- Try again

---

## Performance Optimization

### If app is slow:
1. Clear browser cache
2. Close other tabs
3. Disable extensions
4. Restart browser
5. Try different browser

### If data syncing is slow:
- localStorage is instant locally
- Refresh page if needed
- Check internet connection

---

## Reset Everything

**To start fresh:**

1. **Clear Browser Data:**
   - Open Settings (Ctrl+Shift+Delete)
   - Select "All time"
   - Check "Cookies and other site data"
   - Check "Cached images and files"
   - Click "Clear data"

2. **Sign In Again:**
   - Use demo account or
   - Create new account

3. **Reload App:**
   - Close all app tabs
   - Open fresh tab
   - Visit app URL
   - Everything resets

---

## Still Having Issues?

### Checklist before reporting:
- ✅ Tried refreshing page?
- ✅ Cleared browser cache?
- ✅ Tried different browser?
- ✅ Checked browser console?
- ✅ Read this troubleshooting guide?

### For each issue, provide:
1. What you tried to do
2. What error you got
3. Steps to reproduce
4. Browser and OS info
5. Console error messages

---

## Quick Reference Commands

### Access Points
- Home: `/`
- Login: `/login`
- Signup: `/signup`
- Patient Dashboard: `/patient/dashboard`
- Doctor Dashboard: `/doctor/dashboard`
- Find Doctors: `/patient/doctors`
- Book Appointment: `/patient/book-appointment`
- My Appointments: `/patient/appointments`
- Medical Records: `/patient/medical-records`
- Notifications: `/notifications`

### Demo Accounts
- **Patient:** john.doe@email.com
- **Doctor 1:** dr.smith@smartclinic.com
- **Doctor 2:** dr.johnson@smartclinic.com
- **Password:** (any value)

---

**Last Updated:** March 13, 2026
**Version:** 1.0
**Status:** Complete
