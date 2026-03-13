import { User, Doctor, Patient, Clinic, Appointment, AppointmentSlot, MedicalRecord, CaseHistory, Prescription, Review, Notification } from './types'

const STORAGE_KEYS = {
  USERS: 'clinic_users',
  DOCTORS: 'clinic_doctors',
  PATIENTS: 'clinic_patients',
  CLINICS: 'clinic_clinics',
  APPOINTMENTS: 'clinic_appointments',
  APPOINTMENT_SLOTS: 'clinic_slots',
  MEDICAL_RECORDS: 'clinic_medical_records',
  CASE_HISTORIES: 'clinic_case_histories',
  PRESCRIPTIONS: 'clinic_prescriptions',
  REVIEWS: 'clinic_reviews',
  NOTIFICATIONS: 'clinic_notifications',
  CURRENT_USER: 'clinic_current_user',
}

// Initialize storage with default data
export function initializeStorage() {
  if (typeof window === 'undefined') return

  // Create default clinic if none exists
  const clinics = getItems<Clinic>(STORAGE_KEYS.CLINICS)
  if (clinics.length === 0) {
    const defaultClinic: Clinic = {
      id: 'clinic-001',
      name: 'Smart Clinic - Downtown',
      address: '123 Healthcare St, Medical City, MC 12345',
      phone: '+1 (555) 123-4567',
      email: 'contact@smartclinic.com',
      createdAt: new Date().toISOString(),
    }
    setItems(STORAGE_KEYS.CLINICS, [defaultClinic])
  }

  // Create sample doctors if none exist
  const doctors = getItems<Doctor>(STORAGE_KEYS.DOCTORS)
  if (doctors.length === 0) {
    const sampleDoctors: Doctor[] = [
      {
        id: 'doc-001',
        email: 'dr.smith@smartclinic.com',
        name: 'Dr. Michael Smith',
        role: 'doctor',
        specialization: 'General Medicine',
        licenseNumber: 'LIC-001234',
        phone: '+1 (555) 234-5678',
        bio: 'Experienced general practitioner with 15 years of practice',
        clinicId: 'clinic-001',
        experience: 15,
        rating: 4.8,
        reviewCount: 127,
        createdAt: new Date().toISOString(),
        availableHours: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
        ],
      },
      {
        id: 'doc-002',
        email: 'dr.johnson@smartclinic.com',
        name: 'Dr. Sarah Johnson',
        role: 'doctor',
        specialization: 'Cardiology',
        licenseNumber: 'LIC-005678',
        phone: '+1 (555) 345-6789',
        bio: 'Specialist in cardiovascular health and preventive care',
        clinicId: 'clinic-001',
        experience: 12,
        rating: 4.9,
        reviewCount: 89,
        createdAt: new Date().toISOString(),
        availableHours: [
          { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
          { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
          { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
          { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' },
        ],
      },
      {
        id: 'doc-003',
        email: 'dr.williams@smartclinic.com',
        name: 'Dr. Emily Williams',
        role: 'doctor',
        specialization: 'Dermatology',
        licenseNumber: 'LIC-009012',
        phone: '+1 (555) 456-7890',
        bio: 'Dermatology expert focusing on skin health and treatments',
        clinicId: 'clinic-001',
        experience: 10,
        rating: 4.7,
        reviewCount: 156,
        createdAt: new Date().toISOString(),
        availableHours: [
          { dayOfWeek: 1, startTime: '08:00', endTime: '16:00' },
          { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
          { dayOfWeek: 4, startTime: '08:00', endTime: '16:00' },
          { dayOfWeek: 5, startTime: '08:00', endTime: '16:00' },
        ],
      },
    ]
    setItems(STORAGE_KEYS.DOCTORS, sampleDoctors)
  }

  // Create sample patients if none exist
  const patients = getItems<Patient>(STORAGE_KEYS.PATIENTS)
  if (patients.length === 0) {
    const samplePatients: Patient[] = [
      {
        id: 'pat-001',
        email: 'john.doe@email.com',
        name: 'John Doe',
        role: 'patient',
        dateOfBirth: '1990-05-15',
        phone: '+1 (555) 567-8901',
        address: '456 Oak Avenue, Medical City, MC 54321',
        createdAt: new Date().toISOString(),
      },
    ]
    setItems(STORAGE_KEYS.PATIENTS, samplePatients)
  }
}

export function setItem<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function getItem<T>(key: string, defaultValue?: T): T | null {
  if (typeof window === 'undefined') return defaultValue || null
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : defaultValue || null
}

export function setItems<T>(key: string, values: T[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(values))
}

export function getItems<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  const items = localStorage.getItem(key)
  return items ? JSON.parse(items) : []
}

export function addItem<T extends { id: string }>(key: string, item: T) {
  const items = getItems<T>(key)
  const exists = items.some((i) => i.id === item.id)
  if (!exists) {
    items.push(item)
    setItems(key, items)
  }
  return items
}

export function updateItem<T extends { id: string }>(key: string, item: T) {
  const items = getItems<T>(key)
  const index = items.findIndex((i) => i.id === item.id)
  if (index !== -1) {
    items[index] = item
    setItems(key, items)
  }
  return items
}

export function removeItem<T extends { id: string }>(key: string, id: string) {
  const items = getItems<T>(key)
  const filtered = items.filter((i) => i.id !== id)
  setItems(key, filtered)
  return filtered
}

export function getCurrentUser(): (Doctor | Patient) | null {
  return getItem<Doctor | Patient>(STORAGE_KEYS.CURRENT_USER)
}

export function setCurrentUser(user: Doctor | Patient) {
  setItem(STORAGE_KEYS.CURRENT_USER, user)
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

// User management
export function registerUser(user: Doctor | Patient) {
  if (user.role === 'doctor') {
    return addItem(STORAGE_KEYS.DOCTORS, user as Doctor)
  } else {
    return addItem(STORAGE_KEYS.PATIENTS, user as Patient)
  }
}

export function findUserByEmail(email: string): (Doctor | Patient) | null {
  const doctors = getItems<Doctor>(STORAGE_KEYS.DOCTORS)
  const patients = getItems<Patient>(STORAGE_KEYS.PATIENTS)

  const doctor = doctors.find((d) => d.email === email)
  if (doctor) return doctor

  const patient = patients.find((p) => p.email === email)
  return patient || null
}

export function getDoctors(): Doctor[] {
  return getItems<Doctor>(STORAGE_KEYS.DOCTORS)
}

export function getPatients(): Patient[] {
  return getItems<Patient>(STORAGE_KEYS.PATIENTS)
}

export function getUsers(): (Doctor | Patient)[] {
  const doctors = getDoctors()
  const patients = getPatients()
  return [...doctors, ...patients]
}

export function getDoctorById(id: string): Doctor | null {
  const doctors = getDoctors()
  return doctors.find((d) => d.id === id) || null
}

export function getPatientById(id: string): Patient | null {
  const patients = getPatients()
  return patients.find((p) => p.id === id) || null
}

// Appointment management
export function getAppointments(): Appointment[] {
  return getItems<Appointment>(STORAGE_KEYS.APPOINTMENTS)
}

export function getAppointmentById(id: string): Appointment | null {
  const appointments = getAppointments()
  return appointments.find((a) => a.id === id) || null
}

export function createAppointment(appointment: Appointment) {
  return addItem(STORAGE_KEYS.APPOINTMENTS, appointment)
}

export function updateAppointment(appointment: Appointment) {
  return updateItem(STORAGE_KEYS.APPOINTMENTS, appointment)
}

// Medical Records
export function getMedicalRecords(patientId: string): MedicalRecord[] {
  const records = getItems<MedicalRecord>(STORAGE_KEYS.MEDICAL_RECORDS)
  return records.filter((r) => r.patientId === patientId)
}

export function addMedicalRecord(record: MedicalRecord) {
  return addItem(STORAGE_KEYS.MEDICAL_RECORDS, record)
}

// Case History
export function getCaseHistories(patientId: string): CaseHistory[] {
  const histories = getItems<CaseHistory>(STORAGE_KEYS.CASE_HISTORIES)
  return histories.filter((c) => c.patientId === patientId)
}

export function addCaseHistory(caseHistory: CaseHistory) {
  return addItem(STORAGE_KEYS.CASE_HISTORIES, caseHistory)
}

// Prescriptions
export function getPrescriptions(patientId: string): Prescription[] {
  const prescriptions = getItems<Prescription>(STORAGE_KEYS.PRESCRIPTIONS)
  return prescriptions.filter((p) => p.patientId === patientId)
}

export function addPrescription(prescription: Prescription) {
  return addItem(STORAGE_KEYS.PRESCRIPTIONS, prescription)
}

// Reviews
export function getReviews(doctorId: string): Review[] {
  const reviews = getItems<Review>(STORAGE_KEYS.REVIEWS)
  return reviews.filter((r) => r.doctorId === doctorId)
}

export function addReview(review: Review) {
  const reviews = addItem(STORAGE_KEYS.REVIEWS, review)
  // Update doctor rating
  const doctors = getDoctors()
  const doctor = doctors.find((d) => d.id === review.doctorId)
  if (doctor) {
    const doctorReviews = getReviews(doctor.id)
    const avgRating = doctorReviews.reduce((sum, r) => sum + r.rating, 0) / doctorReviews.length
    doctor.rating = Math.round(avgRating * 10) / 10
    doctor.reviewCount = doctorReviews.length
    updateItem(STORAGE_KEYS.DOCTORS, doctor)
  }
  return reviews
}

// Notifications
export function getNotifications(userId: string): Notification[] {
  const notifications = getItems<Notification>(STORAGE_KEYS.NOTIFICATIONS)
  return notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addNotification(notification: Notification) {
  return addItem(STORAGE_KEYS.NOTIFICATIONS, notification)
}

export function markNotificationAsRead(notificationId: string) {
  const notifications = getItems<Notification>(STORAGE_KEYS.NOTIFICATIONS)
  const notification = notifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
    updateItem(STORAGE_KEYS.NOTIFICATIONS, notification)
  }
}

export const STORAGE_KEYS_EXPORT = STORAGE_KEYS
