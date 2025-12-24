/**
 * Area Code to Location Mapping
 * Static lookup for US/Canada area codes
 */

import { CallLocation } from '../types';

// Comprehensive US area code mapping
const AREA_CODE_MAP: Record<string, { city: string; state: string; region: string }> = {
  // Texas
  '210': { city: 'San Antonio', state: 'TX', region: 'Texas' },
  '214': { city: 'Dallas', state: 'TX', region: 'Texas' },
  '254': { city: 'Waco', state: 'TX', region: 'Texas' },
  '281': { city: 'Houston', state: 'TX', region: 'Texas' },
  '325': { city: 'Abilene', state: 'TX', region: 'Texas' },
  '346': { city: 'Houston', state: 'TX', region: 'Texas' },
  '361': { city: 'Corpus Christi', state: 'TX', region: 'Texas' },
  '409': { city: 'Beaumont', state: 'TX', region: 'Texas' },
  '430': { city: 'Tyler', state: 'TX', region: 'Texas' },
  '432': { city: 'Midland', state: 'TX', region: 'Texas' },
  '469': { city: 'Dallas', state: 'TX', region: 'Texas' },
  '512': { city: 'Austin', state: 'TX', region: 'Texas' },
  '682': { city: 'Fort Worth', state: 'TX', region: 'Texas' },
  '713': { city: 'Houston', state: 'TX', region: 'Texas' },
  '726': { city: 'San Antonio', state: 'TX', region: 'Texas' },
  '737': { city: 'Austin', state: 'TX', region: 'Texas' },
  '806': { city: 'Lubbock', state: 'TX', region: 'Texas' },
  '817': { city: 'Fort Worth', state: 'TX', region: 'Texas' },
  '830': { city: 'Fredericksburg', state: 'TX', region: 'Texas' },
  '832': { city: 'Houston', state: 'TX', region: 'Texas' },
  '903': { city: 'Tyler', state: 'TX', region: 'Texas' },
  '915': { city: 'El Paso', state: 'TX', region: 'Texas' },
  '936': { city: 'Conroe', state: 'TX', region: 'Texas' },
  '940': { city: 'Denton', state: 'TX', region: 'Texas' },
  '956': { city: 'Laredo', state: 'TX', region: 'Texas' },
  '972': { city: 'Dallas', state: 'TX', region: 'Texas' },
  '979': { city: 'College Station', state: 'TX', region: 'Texas' },

  // California
  '209': { city: 'Stockton', state: 'CA', region: 'California' },
  '213': { city: 'Los Angeles', state: 'CA', region: 'California' },
  '310': { city: 'Los Angeles', state: 'CA', region: 'California' },
  '323': { city: 'Los Angeles', state: 'CA', region: 'California' },
  '408': { city: 'San Jose', state: 'CA', region: 'California' },
  '415': { city: 'San Francisco', state: 'CA', region: 'California' },
  '510': { city: 'Oakland', state: 'CA', region: 'California' },
  '530': { city: 'Redding', state: 'CA', region: 'California' },
  '559': { city: 'Fresno', state: 'CA', region: 'California' },
  '562': { city: 'Long Beach', state: 'CA', region: 'California' },
  '619': { city: 'San Diego', state: 'CA', region: 'California' },
  '626': { city: 'Pasadena', state: 'CA', region: 'California' },
  '650': { city: 'San Mateo', state: 'CA', region: 'California' },
  '661': { city: 'Bakersfield', state: 'CA', region: 'California' },
  '707': { city: 'Santa Rosa', state: 'CA', region: 'California' },
  '714': { city: 'Anaheim', state: 'CA', region: 'California' },
  '760': { city: 'Palm Springs', state: 'CA', region: 'California' },
  '805': { city: 'Santa Barbara', state: 'CA', region: 'California' },
  '818': { city: 'Burbank', state: 'CA', region: 'California' },
  '831': { city: 'Monterey', state: 'CA', region: 'California' },
  '858': { city: 'San Diego', state: 'CA', region: 'California' },
  '909': { city: 'San Bernardino', state: 'CA', region: 'California' },
  '916': { city: 'Sacramento', state: 'CA', region: 'California' },
  '925': { city: 'Concord', state: 'CA', region: 'California' },
  '949': { city: 'Irvine', state: 'CA', region: 'California' },
  '951': { city: 'Riverside', state: 'CA', region: 'California' },

  // Florida
  '239': { city: 'Fort Myers', state: 'FL', region: 'Florida' },
  '305': { city: 'Miami', state: 'FL', region: 'Florida' },
  '321': { city: 'Orlando', state: 'FL', region: 'Florida' },
  '352': { city: 'Gainesville', state: 'FL', region: 'Florida' },
  '386': { city: 'Daytona Beach', state: 'FL', region: 'Florida' },
  '407': { city: 'Orlando', state: 'FL', region: 'Florida' },
  '561': { city: 'West Palm Beach', state: 'FL', region: 'Florida' },
  '727': { city: 'St. Petersburg', state: 'FL', region: 'Florida' },
  '754': { city: 'Fort Lauderdale', state: 'FL', region: 'Florida' },
  '772': { city: 'Port St. Lucie', state: 'FL', region: 'Florida' },
  '786': { city: 'Miami', state: 'FL', region: 'Florida' },
  '813': { city: 'Tampa', state: 'FL', region: 'Florida' },
  '850': { city: 'Tallahassee', state: 'FL', region: 'Florida' },
  '863': { city: 'Lakeland', state: 'FL', region: 'Florida' },
  '904': { city: 'Jacksonville', state: 'FL', region: 'Florida' },
  '941': { city: 'Sarasota', state: 'FL', region: 'Florida' },
  '954': { city: 'Fort Lauderdale', state: 'FL', region: 'Florida' },

  // New York
  '212': { city: 'New York', state: 'NY', region: 'New York' },
  '315': { city: 'Syracuse', state: 'NY', region: 'New York' },
  '347': { city: 'New York', state: 'NY', region: 'New York' },
  '516': { city: 'Long Island', state: 'NY', region: 'New York' },
  '518': { city: 'Albany', state: 'NY', region: 'New York' },
  '585': { city: 'Rochester', state: 'NY', region: 'New York' },
  '607': { city: 'Binghamton', state: 'NY', region: 'New York' },
  '631': { city: 'Long Island', state: 'NY', region: 'New York' },
  '646': { city: 'New York', state: 'NY', region: 'New York' },
  '716': { city: 'Buffalo', state: 'NY', region: 'New York' },
  '718': { city: 'New York', state: 'NY', region: 'New York' },
  '845': { city: 'Poughkeepsie', state: 'NY', region: 'New York' },
  '914': { city: 'White Plains', state: 'NY', region: 'New York' },
  '917': { city: 'New York', state: 'NY', region: 'New York' },
  '929': { city: 'New York', state: 'NY', region: 'New York' },

  // Illinois
  '217': { city: 'Springfield', state: 'IL', region: 'Illinois' },
  '224': { city: 'Chicago suburbs', state: 'IL', region: 'Illinois' },
  '309': { city: 'Peoria', state: 'IL', region: 'Illinois' },
  '312': { city: 'Chicago', state: 'IL', region: 'Illinois' },
  '331': { city: 'Aurora', state: 'IL', region: 'Illinois' },
  '618': { city: 'Belleville', state: 'IL', region: 'Illinois' },
  '630': { city: 'Aurora', state: 'IL', region: 'Illinois' },
  '708': { city: 'Chicago suburbs', state: 'IL', region: 'Illinois' },
  '773': { city: 'Chicago', state: 'IL', region: 'Illinois' },
  '779': { city: 'Rockford', state: 'IL', region: 'Illinois' },
  '815': { city: 'Rockford', state: 'IL', region: 'Illinois' },
  '847': { city: 'Chicago suburbs', state: 'IL', region: 'Illinois' },
  '872': { city: 'Chicago', state: 'IL', region: 'Illinois' },

  // Georgia
  '229': { city: 'Albany', state: 'GA', region: 'Georgia' },
  '404': { city: 'Atlanta', state: 'GA', region: 'Georgia' },
  '470': { city: 'Atlanta', state: 'GA', region: 'Georgia' },
  '478': { city: 'Macon', state: 'GA', region: 'Georgia' },
  '678': { city: 'Atlanta', state: 'GA', region: 'Georgia' },
  '706': { city: 'Augusta', state: 'GA', region: 'Georgia' },
  '762': { city: 'Augusta', state: 'GA', region: 'Georgia' },
  '770': { city: 'Atlanta suburbs', state: 'GA', region: 'Georgia' },
  '912': { city: 'Savannah', state: 'GA', region: 'Georgia' },

  // Arizona
  '480': { city: 'Phoenix', state: 'AZ', region: 'Arizona' },
  '520': { city: 'Tucson', state: 'AZ', region: 'Arizona' },
  '602': { city: 'Phoenix', state: 'AZ', region: 'Arizona' },
  '623': { city: 'Phoenix', state: 'AZ', region: 'Arizona' },
  '928': { city: 'Flagstaff', state: 'AZ', region: 'Arizona' },

  // Other major cities
  '202': { city: 'Washington', state: 'DC', region: 'Washington DC' },
  '206': { city: 'Seattle', state: 'WA', region: 'Washington' },
  '303': { city: 'Denver', state: 'CO', region: 'Colorado' },
  '617': { city: 'Boston', state: 'MA', region: 'Massachusetts' },
  '702': { city: 'Las Vegas', state: 'NV', region: 'Nevada' },
  '503': { city: 'Portland', state: 'OR', region: 'Oregon' },
  '615': { city: 'Nashville', state: 'TN', region: 'Tennessee' },
  '901': { city: 'Memphis', state: 'TN', region: 'Tennessee' },
  '504': { city: 'New Orleans', state: 'LA', region: 'Louisiana' },
  '704': { city: 'Charlotte', state: 'NC', region: 'North Carolina' },
  '919': { city: 'Raleigh', state: 'NC', region: 'North Carolina' },
  '414': { city: 'Milwaukee', state: 'WI', region: 'Wisconsin' },
  '612': { city: 'Minneapolis', state: 'MN', region: 'Minnesota' },
  '816': { city: 'Kansas City', state: 'MO', region: 'Missouri' },
  '314': { city: 'St. Louis', state: 'MO', region: 'Missouri' },
  '317': { city: 'Indianapolis', state: 'IN', region: 'Indiana' },
  '313': { city: 'Detroit', state: 'MI', region: 'Michigan' },
  '801': { city: 'Salt Lake City', state: 'UT', region: 'Utah' },
  '505': { city: 'Albuquerque', state: 'NM', region: 'New Mexico' },
  '405': { city: 'Oklahoma City', state: 'OK', region: 'Oklahoma' },
  '808': { city: 'Honolulu', state: 'HI', region: 'Hawaii' },
  '907': { city: 'Anchorage', state: 'AK', region: 'Alaska' },
  // Delaware - mapped to county regions
  '302': { city: 'Wilmington', state: 'DE', region: 'new-castle' },
};

// Delaware city to region mapping
const DELAWARE_CITY_REGIONS: Record<string, string> = {
  // New Castle County
  'Wilmington': 'new-castle',
  'Newark': 'new-castle',
  'New Castle': 'new-castle',
  'Bear': 'new-castle',
  'Middletown': 'new-castle',
  'Claymont': 'new-castle',
  'Pike Creek': 'new-castle',
  'Hockessin': 'new-castle',
  'Elsmere': 'new-castle',
  // Kent County
  'Dover': 'kent',
  'Smyrna': 'kent',
  'Milford': 'kent',
  'Camden': 'kent',
  'Harrington': 'kent',
  'Clayton': 'kent',
  'Felton': 'kent',
  'Wyoming': 'kent',
  // Sussex County
  'Georgetown': 'sussex',
  'Lewes': 'sussex',
  'Rehoboth Beach': 'sussex',
  'Seaford': 'sussex',
  'Milton': 'sussex',
  'Bethany Beach': 'sussex',
  'Dewey Beach': 'sussex',
  'Millsboro': 'sussex',
  'Laurel': 'sussex',
  'Bridgeville': 'sussex',
};

export function getDelawareRegion(city: string): string {
  return DELAWARE_CITY_REGIONS[city] || 'new-castle';
}

/**
 * Get location from phone number
 */
export function getLocationFromPhone(phone: string): CallLocation {
  if (!phone) {
    return { city: null, state: null, region: null, country: null, display: '—', isApproximate: false };
  }

  const digits = phone.replace(/\D/g, '');

  if (digits.length > 11 || (digits.length === 11 && !digits.startsWith('1'))) {
    return { city: null, state: null, region: 'International', country: 'Other', display: 'International', isApproximate: true };
  }

  let areaCode;
  if (digits.length === 11 && digits.startsWith('1')) {
    areaCode = digits.substring(1, 4);
  } else if (digits.length === 10) {
    areaCode = digits.substring(0, 3);
  } else {
    return { city: null, state: null, region: null, country: 'USA', display: 'Unknown', isApproximate: true };
  }

  const exactMatch = AREA_CODE_MAP[areaCode];
  if (exactMatch) {
    return {
      city: exactMatch.city,
      state: exactMatch.state,
      region: exactMatch.region,
      country: 'USA',
      display: `${exactMatch.city}, ${exactMatch.state}`,
      isApproximate: false
    };
  }

  return { city: null, state: null, region: null, country: 'USA', display: 'Unknown', isApproximate: true };
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return phone;
}

export default { getLocationFromPhone, formatPhoneNumber };
