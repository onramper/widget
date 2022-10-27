import { CoreError } from '@onramper/ramp-core/errors';

// TYPES
//= =====
type ResultOrError<TResult> = Promise<TResult | CoreError>;
export type CurrenciesOrError = ResultOrError<Currency[]>;
export type CurrencyOrError = ResultOrError<Currency>;

// INTERFACES
//= ==========
export interface AppDatabase {
  getCurrenciesInfo(params: CurrenciesQueryParams): any;
  getCurrencyForId(id: string, countryId?: string): any;
  getCurrrencyTypes(): any;
  getCurrencyCountryBlackList(countryId: string): any;
  getAllNetworks(): any;
  getAllPaymentTypes(): any;
}

// ERROR CODES
export enum ErrorCodes {
  EnpointDisabledCode = 1001,
  EnvVarsError = 1002,
  OtherDatabaseError = 1004,
  InvalidPortNumber = 1003,
  InvalidCurrencyId = 1005,
  InvalidCurrencyType = 1006,
  InvalidCurrencyTypeName = 1007,
  InvalidCountryCode = 1008,
}

// MODELS
//= ======
export class Currency {
  index: number;

  id: string;

  name: string;

  type: string;

  symbol: string;

  network: string;

  constructor(
    index: number,
    id: string,
    name: string,
    type: string,
    symbol: string,
    network: string
  ) {
    this.index = index;
    this.id = id;
    this.name = name;
    this.type = type;
    this.symbol = symbol;
    this.network = network;
  }
}

// Parameter Objects
export interface ServiceQueryParams {
  country?: string;
}

export interface CurrenciesQueryParams extends ServiceQueryParams {
  pay?: string[];
  participation?: string[];
  onramp?: string[];
  network?: string[];
  type?: string[];
}

export interface CurrencyNetworksQueryParams {
  network: string;
}

// CUSTOM ERRORS
//= =============
export class CurrencyNotFoundError extends CoreError {
  constructor(currencyId: string) {
    super(
      ErrorCodes.InvalidCurrencyId,
      `The currency with Id: ${currencyId} cannot be found. Provide a valid currency Id.`
    );
  }
}

export class CurrencyValidationError extends CoreError {
  constructor(message: string) {
    super(4000, message);
  }
}
