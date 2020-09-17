interface IJSON {
  [key: string]: any;
}

interface IResponseOptions {
  body: IJSON;
  statusCode: number;
  allowCORS?: boolean;
  cacheTTL?: number;
}

export type dateInfo = {
  year: number;
  month: number;
  day: number;
};

export type stepDataItems = Array<
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
    }
>;

interface FileStep {
  type: 'file';
  humanName: string;
  hint?: string;
  url: string;
  acceptedContentTypes: string[];
}

export type nextStep =
  | {
      type: 'iframe' | 'redirect' | 'form';
      url: string;
      data?: stepDataItems;
    }
  | FileStep
  | {
      type: 'pickOne';
      options: FileStep[];
    }
  | { type: 'completed' }
  | {
      type: 'requestBankTransaction';
      depositBankAccount: {
        iban: string;
        bic: string;
        bankName: string;
        bankAddress: string;
        accountName: string;
        accountAddress: string;
      };
      reference: string;
      hint: string;
    };