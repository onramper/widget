type StepFormBaseField = { 
    placeholder?: string;
    icon?: string;
    iconPosition?: "start" | "end";
}; 

type StepDataItems = Array<
    StepFormBaseField & (| {
        type: "select";
        name: string;
        humanName: string;
        options: {
            value: string;
            humanName: string;
            icon?: string;
        }[];
        hint?: string;
        required?: boolean;
    }
    | {
        type: 'choice',
        options: string[],
        humanName: string;
        name: string;
        hint?: string;
        required?: boolean;
    }
    | {
        type: 'string' | 'integer';
        humanName: string;
        name: string;
        hint?: string;
        required?: boolean;
    }
    | {
        type: 'date';
        name: string;
        humanName: string;
        hint?: string;
        required?: boolean;
        data: [
            {
                type: 'integer';
                humanName: 'Day';
                name: 'day';
            },
            {
                type: 'integer';
                humanName: 'Month';
                name: 'month';
            },
            {
                type: 'integer';
                humanName: 'Year';
                name: 'year';
            }
        ];
    }
    | {
        type: 'boolean';
        name: 'termsOfUse';
        terms: {
            url: string;
            humanName: string;
        }[];
    })
>;

interface FileStep {
    type: 'file';
    humanName: string;
    hint?: string;
    url: string;
    acceptedContentTypes: string[];
}

interface InfoDepositBankAccount {
    iban: string;
    bic: string;
    bankName: string;
    bankAddress: string;
    accountName: string;
    accountAddress: string;
}

type NextStep =
    { useHeading?: boolean, title?: string, progress?: number } & (FileStep
    | {
        type: 'information';
        url?: string;
        message: string;
        extraData?: StepDataItems;
    } | {
        type: 'form';
        url: string;
        data: StepDataItems;
        humanName?: string; // TODO: force all forms to have humanName
        hint?: string;
    } | {
        type: 'iframe';
        url: string;
        fullscreen: boolean;
        neededFeatures?: string;
        humanName?: string; // TODO: force all forms to have humanName
    } | {
        type: 'redirect';
        url: string;
        hint?: string;
        humanName?: string; // TODO: force all forms to have humanName
    } | {
        type: 'wait';
        url: string;
        extraData?: StepDataItems;
    } | {
        type: 'pickOne';
        options: FileStep[];
        humanName?: string
        hint?: string
    } | {
        type: 'completed',
        trackingUrl: string
    } | {
        type: 'requestBankTransaction';
        depositBankAccount: InfoDepositBankAccount;
        reference: string;
        hint: string;
    });

interface FieldError {
    field: string
    message: string
}

type NextStepErr = FieldError[] | { message: string }

export type {
    NextStep,
    StepDataItems,
    InfoDepositBankAccount,
    FileStep,
    NextStepErr,
    FieldError
}
