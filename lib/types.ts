export interface User {
  id: string
  email: string
  name: string
  role: 'doctor' | 'patient'
  createdAt: string
}

export interface Doctor extends User {
  role: 'doctor'
  specialization: string
  licenseNumber: string
  phone: string
  bio: string
  clinicId: string
  avatar?: string
  rating: number
  reviewCount: number
  experience: number // years
  availableHours: {
    dayOfWeek: number
    startTime: string
    endTime: string
  }[]
}

export interface Patient extends User {
  role: 'patient'
  dateOfBirth: string
  phone: string
  address: string
  medicalHistory?: string
  avatar?: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  appointmentId?: string
  doctorId: string
  recordType: 'diagnosis' | 'test' | 'procedure' | 'note'
  title: string
  description: string
  date: string
  createdAt: string
}

export interface CaseHistory {
  id: string
  patientId: string
  doctorId: string
  appointmentId: string
  caseTitle: string
  symptoms: string[]
  diagnosis: string
  treatment: string
  followUpDate?: string
  notes: string
  createdAt: string
}

export interface Prescription {
  id: string
  appointmentId: string
  patientId: string
  doctorId: string
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }[]
  notes?: string
  createdAt: string
  expiryDate: string
}

export interface Review {
  id: string
  doctorId: string
  patientId: string
  rating: number // 1-5
  comment: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'appointment' | 'reminder' | 'prescription' | 'message'
  title: string
  message: string
  relatedId?: string
  read: boolean
  createdAt: string
}

export interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  email: string
  createdAt: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  clinicId: string
  dateTime: string
  duration: number // in minutes
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
}

export interface AppointmentSlot {
  id: string
  doctorId: string
  startTime: string
  endTime: string
  isAvailable: boolean
  appointmentId?: string
}
