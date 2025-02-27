export interface ReportDataInterface {
    _id:string;
    user: {
        id: string;
        username: string;
        role:string;
    };
    role: string; 
    title: string;
    detail: string; 
    date: string; 
    response: string;
    status: string;
}
