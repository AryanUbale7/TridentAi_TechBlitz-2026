'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getMedicalRecords, getCaseHistories, getPrescriptions } from '@/lib/storage'
import { Patient, MedicalRecord, CaseHistory, Prescription } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Activity, Pill, AlertCircle } from 'lucide-react'

export default function MedicalRecordsPage() {
  const router = useRouter()
  const [user, setUser] = useState<Patient | null>(null)
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [cases, setCases] = useState<CaseHistory[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'patient') {
      router.push('/login')
      return
    }
    setUser(currentUser as Patient)
    setRecords(getMedicalRecords(currentUser.id))
    setCases(getCaseHistories(currentUser.id))
    setPrescriptions(getPrescriptions(currentUser.id))
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Medical Records</h1>
          <p className="text-muted-foreground">View your complete medical history and documents</p>
        </div>

        <Tabs defaultValue="records" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-border rounded-xl p-1">
            <TabsTrigger value="records" className="rounded-lg">
              <FileText className="w-4 h-4 mr-2" />
              Medical Records
            </TabsTrigger>
            <TabsTrigger value="cases" className="rounded-lg">
              <Activity className="w-4 h-4 mr-2" />
              Case History
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="rounded-lg">
              <Pill className="w-4 h-4 mr-2" />
              Prescriptions
            </TabsTrigger>
          </TabsList>

          {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-4 mt-6">
            {records.length === 0 ? (
              <Card className="border-0 bg-white">
                <CardContent className="pt-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No medical records available</p>
                </CardContent>
              </Card>
            ) : (
              records.map((record) => (
                <Card key={record.id} className="border-0 bg-white hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="capitalize">{record.recordType}</CardTitle>
                        <CardDescription>{record.title}</CardDescription>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-foreground text-sm leading-relaxed">{record.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Case History Tab */}
          <TabsContent value="cases" className="space-y-4 mt-6">
            {cases.length === 0 ? (
              <Card className="border-0 bg-white">
                <CardContent className="pt-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No case history available</p>
                </CardContent>
              </Card>
            ) : (
              cases.map((caseItem) => (
                <Card key={caseItem.id} className="border-0 bg-white hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 bg-gradient-to-r from-accent/5 to-primary/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{caseItem.caseTitle}</CardTitle>
                        <CardDescription>Case updated on {new Date(caseItem.createdAt).toLocaleDateString()}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">Symptoms:</h4>
                      <div className="flex flex-wrap gap-1">
                        {caseItem.symptoms.map((symptom, idx) => (
                          <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">Diagnosis:</h4>
                      <p className="text-sm text-foreground">{caseItem.diagnosis}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">Treatment:</h4>
                      <p className="text-sm text-foreground">{caseItem.treatment}</p>
                    </div>
                    {caseItem.followUpDate && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Follow-up:</span> {new Date(caseItem.followUpDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-4 mt-6">
            {prescriptions.length === 0 ? (
              <Card className="border-0 bg-white">
                <CardContent className="pt-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No prescriptions available</p>
                </CardContent>
              </Card>
            ) : (
              prescriptions.map((prescription) => (
                <Card key={prescription.id} className="border-0 bg-white hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-green-50">
                    <div>
                      <CardTitle>Prescription</CardTitle>
                      <CardDescription>Issued on {new Date(prescription.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {prescription.medications.map((med, idx) => (
                      <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                        <h4 className="font-semibold text-foreground">{med.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Dosage:</span> {med.dosage}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Frequency:</span> {med.frequency}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Duration:</span> {med.duration}
                        </p>
                        {med.instructions && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">Instructions:</span> {med.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                    {prescription.notes && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-900">
                          <span className="font-semibold">Doctor's Notes:</span> {prescription.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
