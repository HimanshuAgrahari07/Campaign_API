class TodoErrors extends Error {
    public status: number;
    public message: string;
    public statusText: string;
    public errorCode: string;

    constructor(error: { status: number; message: string; statusText: string; errorCode: string }) {
        super();

        this.status = error.status;
        this.message = error.message;
        this.statusText = error.statusText;
        this.errorCode = error.errorCode;
    }
}

export default TodoErrors;
