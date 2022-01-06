const countryLanguagePairings: {[key: string]: string} = {
    JP: 'ja',
    KR: 'ko',
    // Undefined countries will use the default language defined below.
};
const defaultLanguageForUndefinedCountries = 'en';

/**
 * Will return the code for the default language spoken in the provided country.
 *
 * @param country The Alpha-2 ISO 3166 country code. E.g. 'JP'. See:
 * https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
 * @returns The ISO 639-1 language code. E.g. 'ja'. See: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
export function getDefaultLanguageForCountry(country?: string) {
    return countryLanguagePairings[country ? country.toUpperCase() : ''] ?? defaultLanguageForUndefinedCountries;
}