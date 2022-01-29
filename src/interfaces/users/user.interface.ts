interface User {
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    countryId: number;
    organization?: {
        name: string,
        uid: string,
    };
    organizationId?: number;
    role?: string;
}

export default User;
