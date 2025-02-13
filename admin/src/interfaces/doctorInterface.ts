export interface DoctorInterface {
    _id: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    firstname: string;
    lastname: string;
    occupation: string;
    expert: string;
    hospital: string;
    document: string;
    approval: {
        status: 'pending' | 'approve' | 'disapprove';
        reason?: string;
    };
    image?: string;
}
