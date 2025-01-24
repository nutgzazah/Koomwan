export interface DoctorInterface {
    doctor_id: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    first_name: string;
    last_name: string;
    occupation: string;
    expert: string;
    hospital: string;
    document: string;
    approval: 'pending' | 'approve' | 'disapprove';
    reason?: string;
    image?: string;
}
