interface httpHeader {
    Authorization?: string;
    Cookie?: string;
    "Content-Type"?: string;
    [props: string]: any
}

interface httpOption {
    method?:string;
    header?: httpHeader
    data?: any;
    timeout?: number;
    config?: {
        eventType?: string;
    };
    [props: string]: any
}

interface createOption extends httpOption {
    url?: string;
    baseUrl?: string;
    method?: string;
    uploadUrl?: string;
    downloadUrl?: string;
}

interface requestType<T = any> {
    (option?: httpOption & { url: string }): Promise<T>;
    (url: string, option?: httpOption): Promise<T>;
}

interface downloadConfig {
    header?: httpHeader;
    filePath: string;
    [props: string]: any;
}

interface uploadConfig {
    header?: httpHeader;
    filePath: string;
    name: string;
    formData: {
        [props: string]: any;
    }
    [props: string]: any;
}

interface downloadType<T = any> {
    (option?: downloadConfig & { url: string }): Promise<T>;
    (url: string, option?: httpOption): Promise<T>;
}

interface uploadType<T = any> {
    (option?: uploadConfig & { url: string }): Promise<T>;
    (url: string, option?: httpOption): Promise<T>;
}

interface wefetch {
    defaults: {
        baseUrl: string;
        uploadUrl: string;
        downloadUrl: string;
    }
    create(options: createOption): wefetch;

    before: {
        use(interceptor: (resolveCallback: (request:httpOption & { url: string }) => void, rejectCallback: (reason:any) => void) => void): void
    };

    after: {
        use(interceptor: (resolveCallback: (response:any) => void, rejectCallback: (reason:any) => void) => void): void
    };

    request: requestType;

    get: requestType;

    post: requestType;

    head: requestType;

    connect: requestType;

    put: requestType;

    delete: requestType;

    trace: requestType;


    download: downloadType;

    upload: uploadType;


    on(eventType: string, callback: (requestTask: any) => void);

    abort(eventType: string, callback: () => void);

    onProcess(eventType: string, callback: (progress: any) => void);


    retry<T = any>(times: number, request: requestType, timeout: number): Promise<T>;

    finally<T = any>(value?: any): Promise<T>;

    all<TResponse = any>(promises?: Promise<TResponse>[]): Promise<TResponse[]>;


    promisify<TConfig = any, TResponse = any>(api: any): (option: TConfig) => Promise<TResponse>;
}

declare const wefetchInstance:wefetch

export default wefetchInstance
