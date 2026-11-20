import type { WeatherConditionMeta } from '../services/weatherApi';

export type LanguageCode = 'en' | 'ku-ba-ar' | 'ku-ba-la' | 'ku-so';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  shortLabel: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', shortLabel: 'EN', dir: 'ltr' },
  { code: 'ku-ba-ar', label: 'کوردی (بادینی)', shortLabel: 'بادینی', dir: 'rtl' },
  { code: 'ku-ba-la', label: 'Kurdî (Badînî)', shortLabel: 'Badînî', dir: 'ltr' },
  { code: 'ku-so', label: 'کوردی (سۆرانی)', shortLabel: 'سۆرانی', dir: 'rtl' },
];

export interface TranslationStrings {
  brandName: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  clearSearch: string;
  searchingLocations: string;
  searchUnavailable: string;
  noMatchingCities: string;
  myLocation: string;
  locating: string;
  saveCity: string;
  saved: string;
  savedCities: string;
  savedCitiesHint: string;
  saveCurrentCity: string;
  removeCity: string;
  emptySlot: string;
  searchToSaveHint: string;
  slotsFull: string;
  refresh: string;
  refreshAria: string;
  localTime: string;
  updatedAt: string;
  feelsLike: string;
  highLow: string;
  cloudCover: string;
  wind: string;
  gusts: string;
  humidity: string;
  dewPoint: string;
  pressure: string;
  surfaceLevel: string;
  uvIndex: string;
  peak: string;
  visibility: string;
  precip: string;
  daylight: string;
  sunset: string;
  next24Hours: string;
  next24HoursHint: string;
  now: string;
  outlook7Day: string;
  outlook7DayHint: string;
  precipitation: string;
  maxWind: string;
  peakUv: string;
  sunriseSunset: string;
  toWord: string;
  today: string;
  tomorrow: string;
  weekdays: string[];
  months: string[];
  uvLevels: {
    low: string;
    moderate: string;
    high: string;
    veryHigh: string;
    extreme: string;
  };
  compass: string[];
  geolocationUnsupported: string;
  geolocationDenied: string;
  geolocationFailed: string;
  reverseLookupFailed: string;
  weatherLoadError: string;
  unableToLoadTitle: string;
  tryAgain: string;
  retry: string;
  dismissNotice: string;
  dataAttribution: string;
  elevation: string;
  settings: string;
  appearance: string;
  autoMode: string;
  autoModeHint: string;
  lightMode: string;
  darkMode: string;
  language: string;
  units: string;
  metricUnit: string;
  imperialUnit: string;
  close: string;
  unitLabels: {
    kmh: string;
    mph: string;
    km: string;
    mi: string;
    mm: string;
    hpa: string;
    m: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: {
    brandName: 'Weather KRD',
    searchPlaceholder: 'Search city or region...',
    searchAriaLabel: 'Search city or region',
    clearSearch: 'Clear search',
    searchingLocations: 'Searching locations...',
    searchUnavailable: 'Search unavailable. Please try again.',
    noMatchingCities: 'No matching cities found for',
    myLocation: 'My Location',
    locating: 'Locating...',
    saveCity: 'Save city',
    saved: 'Saved',
    savedCities: 'Saved Cities',
    savedCitiesHint: 'Quick-access weather slots (up to 4 cities)',
    saveCurrentCity: 'Save',
    removeCity: 'Remove city',
    emptySlot: 'Empty slot',
    searchToSaveHint: 'Search a city above to save here',
    slotsFull: '4 / 4 saved · Remove one to add another',
    refresh: 'Refresh',
    refreshAria: 'Refresh live weather',
    localTime: 'Local',
    updatedAt: 'Updated',
    feelsLike: 'Feels like',
    highLow: 'High / Low',
    cloudCover: 'Cloud cover',
    wind: 'Wind',
    gusts: 'Gusts',
    humidity: 'Humidity',
    dewPoint: 'Dew point',
    pressure: 'Pressure',
    surfaceLevel: 'Surface level',
    uvIndex: 'UV Index',
    peak: 'Peak',
    visibility: 'Visibility',
    precip: 'Precip',
    daylight: 'Daylight',
    sunset: 'Sunset',
    next24Hours: 'Next 24 Hours',
    next24HoursHint: 'Select any hour to inspect temperature and rain chance',
    now: 'Now',
    outlook7Day: '7-Day Outlook',
    outlook7DayHint: 'Click any day for sunrise, rain, and wind details',
    precipitation: 'Precipitation',
    maxWind: 'Max Wind',
    peakUv: 'Peak UV',
    sunriseSunset: 'Sunrise / Sunset',
    toWord: 'to',
    today: 'Today',
    tomorrow: 'Tomorrow',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    uvLevels: {
      low: 'Low',
      moderate: 'Moderate',
      high: 'High',
      veryHigh: 'Very high',
      extreme: 'Extreme',
    },
    compass: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
    geolocationUnsupported: 'Geolocation is not supported by your browser. Search for any city above.',
    geolocationDenied: 'Location access was denied. Search for any city above.',
    geolocationFailed: 'Unable to acquire your current position. Search for any city above.',
    reverseLookupFailed: 'Unable to determine your location name.',
    weatherLoadError: 'Could not load live weather data. Please check your connection and try again.',
    unableToLoadTitle: 'Unable to load live weather',
    tryAgain: 'Try again',
    retry: 'Retry',
    dismissNotice: 'Dismiss notice',
    dataAttribution: 'Live meteorological data provided by',
    elevation: 'Elev',
    settings: 'Settings',
    appearance: 'Appearance',
    autoMode: 'Auto',
    autoModeHint: 'Automatically switches between light and dark based on day and night at the selected location.',
    lightMode: 'Light',
    darkMode: 'Dark',
    language: 'Language',
    units: 'Units',
    metricUnit: 'Celsius · km/h',
    imperialUnit: 'Fahrenheit · mph',
    close: 'Close',
    unitLabels: {
      kmh: 'km/h',
      mph: 'mph',
      km: 'km',
      mi: 'mi',
      mm: 'mm',
      hpa: 'hPa',
      m: 'm',
    },
  },
  'ku-ba-ar': {
    brandName: 'Weather KRD',
    searchPlaceholder: 'ل باژێڕەکێ یان دەڤەرەکێ بگەڕە...',
    searchAriaLabel: 'ل باژێڕەکێ یان دەڤەرەکێ بگەڕە',
    clearSearch: 'پاقژکرنا گەڕیانێ',
    searchingLocations: 'ل جهـ و باژێڕان دگەڕیت...',
    searchUnavailable: 'گەڕیان نها بەردەست نینە. هیڤییە دووبارە هەول بدە.',
    noMatchingCities: 'چ باژێڕ نەهاتنە دیتن بۆ',
    myLocation: 'جهێ من',
    locating: 'ل جهێ من دگەڕیت...',
    saveCity: 'تۆمارکرن',
    saved: 'تۆمارکرییە',
    savedCities: 'باژێڕێن تۆمارکری',
    savedCitiesHint: 'جهێن بلەز یێن کەشوهەوای (هەتا ٤ باژێڕان)',
    saveCurrentCity: 'تۆمارکرنا',
    removeCity: 'لابرنا باژێڕی',
    emptySlot: 'جهەکێ بەتال',
    searchToSaveHint: 'ل سەری ل باژێڕەکێ بگەڕە دا ل ڤێرێ تۆمار بکەی',
    slotsFull: '٤ / ٤ تۆمارکرینە · ئێکێ لابدە دا یەکێ دی زێدە بکەی',
    refresh: 'نووکرن',
    refreshAria: 'نووکرنا کەشوهەوایێ زیندی',
    localTime: 'دەمێ جهی',
    updatedAt: 'نووکری ل',
    feelsLike: 'هەستپێکری',
    highLow: 'بلندترین / نزمترین',
    cloudCover: 'عەور',
    wind: 'با',
    gusts: 'گوڕیا بایی',
    humidity: 'شێداری',
    dewPoint: 'خالا خوناڤێ',
    pressure: 'پەستانا هەوایی',
    surfaceLevel: 'ئاستێ ئەردی',
    uvIndex: 'پێنوێنێ UV',
    peak: 'بلندترین',
    visibility: 'مەودایێ دیتنێ',
    precip: 'بارین',
    daylight: 'هەلبوونا رۆژێ',
    sunset: 'ئاڤابوون',
    next24Hours: '٢٤ دەمژمێرێن بهێت',
    next24HoursHint: 'دەمژمێرەکێ هەلبژێرە بۆ دیتنا پلەیا گەرماتیێ و ڕێژەیا بارانێ',
    now: 'نوکە',
    outlook7Day: 'پێشبینیا ٧ رۆژان',
    outlook7DayHint: 'کلیک بکە بۆ دیتنا هەلبوونا رۆژێ، باران، و هویرکاریێن بایی',
    precipitation: 'بارین',
    maxWind: 'بلندترین با',
    peakUv: 'بلندترین UV',
    sunriseSunset: 'هەلبوون / ئاڤابوون',
    toWord: 'هەتا',
    today: 'ئەڤرۆ',
    tomorrow: 'سوبەهی',
    weekdays: ['ئێکشەمب', 'دووشەمب', 'سێشەمب', 'چوارشەمب', 'پێنجشەمب', 'ئەینی', 'شەمبی'],
    months: ['کانوونا ٢', 'شوبات', 'ئادار', 'نیسان', 'گولان', 'حوزەیران', 'تیرمەهـ', 'تەباخ', 'ئەیلول', 'چریا ١', 'چریا ٢', 'کانوونا ١'],
    uvLevels: {
      low: 'نزم',
      moderate: 'ناڤنجی',
      high: 'بلند',
      veryHigh: 'گەلەک بلند',
      extreme: 'دژوار',
    },
    compass: ['بک', 'بک-رهـ', 'بک-رهـ', 'رهـ-بک', 'رهـ', 'رهـ-بش', 'بش-رهـ', 'بش-رهـ', 'بش', 'بش-را', 'بش-را', 'را-بش', 'را', 'را-بک', 'بک-را', 'بک-را'],
    geolocationUnsupported: 'جهنیشاندەر د ڤی گەڕۆکیدا پشتەڤانی ناکرێت. ل سەری ل باژێڕەکێ بگەڕە.',
    geolocationDenied: 'دەستپێگەهشتنا جهی هاتە رەتکرن. ل سەری ل باژێڕەکێ بگەڕە.',
    geolocationFailed: 'جهێ نوکە نەهاتە وەرگرتن. ل سەری ل باژێڕەکێ بگەڕە.',
    reverseLookupFailed: 'ناڤێ جهێ تە نەهاتە زانین.',
    weatherLoadError: 'زانیاریێن کەشوهەوایێ زیندی نەهاتنە بارکرن. هیڤییە پەیوەندیا خۆ بپشکنە و دووبارە هەول بدە.',
    unableToLoadTitle: 'کەشوهەوا نەهاتە بارکرن',
    tryAgain: 'دووبارە هەول بدە',
    retry: 'دووبارە',
    dismissNotice: 'لابرنا ئاگەهداریێ',
    dataAttribution: 'زانیاریێن کەشوهەوایێ زیندی ژ',
    elevation: 'بلندی',
    settings: 'رێکخستن',
    appearance: 'شێواز',
    autoMode: 'خۆکار',
    autoModeHint: 'ب شێوەیەکێ خۆکار دناڤبەرا ڕووناک و تاریدا دهێتە گوهۆڕین ل دویڤ ڕۆژ و شەڤا جهێ هەلبژارتی.',
    lightMode: 'ڕووناک',
    darkMode: 'تاری',
    language: 'زمان',
    units: 'یەکەیێن پێڤانێ',
    metricUnit: 'سێلسیۆس · کم/د',
    imperialUnit: 'فەهرەنهایت · میل/د',
    close: 'گرتن',
    unitLabels: {
      kmh: 'کم/د',
      mph: 'میل/د',
      km: 'کم',
      mi: 'میل',
      mm: 'ملم',
      hpa: 'hPa',
      m: 'م',
    },
  },
  'ku-ba-la': {
    brandName: 'Weather KRD',
    searchPlaceholder: 'Li bajêrekî yan deverekê bigere...',
    searchAriaLabel: 'Li bajêrekî yan deverekê bigere',
    clearSearch: 'Paqijkirina geriyanê',
    searchingLocations: 'Li cih û bajêran digere...',
    searchUnavailable: 'Geriyan niha berdest nîne. Hêvî ye dîsa hewl bide.',
    noMatchingCities: 'Çi bajêr nehatin dîtin bo',
    myLocation: 'Cihê min',
    locating: 'Li cihê min digere...',
    saveCity: 'Tomarkirin',
    saved: 'Tomarkirî ye',
    savedCities: 'Bajêrên Tomarkirî',
    savedCitiesHint: 'Cihên bilez yên keşûhewayê (heta 4 bajêran)',
    saveCurrentCity: 'Tomarkirina',
    removeCity: 'Rakirina bajêrî',
    emptySlot: 'Cihekê betal',
    searchToSaveHint: 'Li jor li bajêrekî bigere da li vêrê tomar bikî',
    slotsFull: '4 / 4 tomarkirî ne · Êkê rake da yekê dî zêde bikî',
    refresh: 'Nûkirin',
    refreshAria: 'Nûkirina keşûhewayê zîndî',
    localTime: 'Demê cihî',
    updatedAt: 'Nûkirî li',
    feelsLike: 'Hestpêkirî',
    highLow: 'Bilindtirîn / Nizmtirîn',
    cloudCover: 'Ewr',
    wind: 'Ba',
    gusts: 'Guriya bayî',
    humidity: 'Şêdarî',
    dewPoint: 'Xala xunavê',
    pressure: 'Pestana hewayî',
    surfaceLevel: 'Astê erdî',
    uvIndex: 'Pênwênê UV',
    peak: 'Bilindtirîn',
    visibility: 'Mewdayê dîtinê',
    precip: 'Barîn',
    daylight: 'Helbûna rojê',
    sunset: 'Avabûn',
    next24Hours: '24 demjimêrên bihêt',
    next24HoursHint: 'Demjimêrekê helbijêre bo dîtina pleya germatiyê û rêjeya baranê',
    now: 'Nuke',
    outlook7Day: 'Pêşbîniya 7 rojan',
    outlook7DayHint: 'Klîk bike bo dîtina helbûna rojê, baran û hûrkariyên bayî',
    precipitation: 'Barîn',
    maxWind: 'Bilindtirîn ba',
    peakUv: 'Bilindtirîn UV',
    sunriseSunset: 'Helbûn / Avabûn',
    toWord: 'heta',
    today: 'Evro',
    tomorrow: 'Sibehî',
    weekdays: ['Êkşemb', 'Dûşemb', 'Sêşemb', 'Çwarşemb', 'Pêncşemb', 'Eynî', 'Şembî'],
    months: ['Kanûna 2', 'Şubat', 'Adar', 'Nîsan', 'Gulan', 'Huzeyran', 'Tîrmeh', 'Tebax', 'Eylûl', 'Çiriya 1', 'Çiriya 2', 'Kanûna 1'],
    uvLevels: {
      low: 'Nizm',
      moderate: 'Navincî',
      high: 'Bilind',
      veryHigh: 'Gelek bilind',
      extreme: 'Dijwar',
    },
    compass: ['Bk', 'Bk-Rh', 'Bk-Rh', 'Rh-Bk', 'Rh', 'Rh-Bş', 'Bş-Rh', 'Bş-Rh', 'Bş', 'Bş-Ra', 'Bş-Ra', 'Ra-Bş', 'Ra', 'Ra-Bk', 'Bk-Ra', 'Bk-Ra'],
    geolocationUnsupported: 'Cihnîşander di vî gerokî de nayê piştgirî kirin. Li jor li bajêrekî bigere.',
    geolocationDenied: 'Destpêgehiştina cihî hat redkirin. Li jor li bajêrekî bigere.',
    geolocationFailed: 'Cihê nuke nehat wergirtin. Li jor li bajêrekî bigere.',
    reverseLookupFailed: 'Navê cihê te nehat zanîn.',
    weatherLoadError: 'Zanyariyên keşûhewayê zîndî nehatin barkirin. Hêvî ye girêdana xwe bipişkine û dîsa hewl bide.',
    unableToLoadTitle: 'Keşûhewa nehat barkirin',
    tryAgain: 'Dîsa hewl bide',
    retry: 'Dîsa',
    dismissNotice: 'Rakirina agehdariyê',
    dataAttribution: 'Zanyariyên keşûhewayê zîndî ji',
    elevation: 'Bilindî',
    settings: 'Rêkxistin',
    appearance: 'Şêwaz',
    autoMode: 'Xokar',
    autoModeHint: 'Bi awayekî xokar dinavbera ronak û tarî de tê guhorîn li dûv roj û şeva cihê helbijartî.',
    lightMode: 'Ronak',
    darkMode: 'Tarî',
    language: 'Ziman',
    units: 'Yekeyên pêvanê',
    metricUnit: 'Sêlsiyos · km/d',
    imperialUnit: 'Fehrenhayt · mîl/d',
    close: 'Girtin',
    unitLabels: {
      kmh: 'km/d',
      mph: 'mîl/d',
      km: 'km',
      mi: 'mîl',
      mm: 'mm',
      hpa: 'hPa',
      m: 'm',
    },
  },
  'ku-so': {
    brandName: 'Weather KRD',
    searchPlaceholder: 'بگەڕێ بۆ شار یان ناوچە...',
    searchAriaLabel: 'بگەڕێ بۆ شار یان ناوچە',
    clearSearch: 'سڕینەوەی گەڕان',
    searchingLocations: 'بۆ شوێنەکان دەگەڕێت...',
    searchUnavailable: 'گەڕان لەم کاتەدا بەردەست نییە. تکایە دووبارە هەوڵبدەرەوە.',
    noMatchingCities: 'هیچ شارێک نەدۆزرایەوە بۆ',
    myLocation: 'شوێنی من',
    locating: 'شوێنەکەت دەدۆزرێتەوە...',
    saveCity: 'پاشەکەوتکردن',
    saved: 'پاشەکەوتکراو',
    savedCities: 'شارە پاشەکەوتکراوەکان',
    savedCitiesHint: 'شوێنە خێراکانی کەشوهەوا (تا ٤ شار)',
    saveCurrentCity: 'پاشەکەوتکردنی',
    removeCity: 'سڕینەوەی شار',
    emptySlot: 'شوێنی بەتاڵ',
    searchToSaveHint: 'لە سەرەوە بۆ شارێک بگەڕێ بۆ پاشەکەوتکردن',
    slotsFull: '٤ / ٤ پاشەکەوتکراون · یەکێک بسڕەوە بۆ زیادکردنی شارێکی تر',
    refresh: 'نوێکردنەوە',
    refreshAria: 'نوێکردنەوەی کەشوهەوای ڕاستەوخۆ',
    localTime: 'کاتی ناوخۆ',
    updatedAt: 'نوێکراوەتەوە لە',
    feelsLike: 'هەستپێکراو',
    highLow: 'بەرزترین / نزمترین',
    cloudCover: 'هەور',
    wind: 'با',
    gusts: 'تەوژمی با',
    humidity: 'شێ',
    dewPoint: 'خاڵی شەونم',
    pressure: 'پەستانی هەوا',
    surfaceLevel: 'ئاستی ڕووی زەوی',
    uvIndex: 'پێوەری UV',
    peak: 'لوتکە',
    visibility: 'مەودای بینین',
    precip: 'بارین',
    daylight: 'خۆرهەڵاتن',
    sunset: 'خۆرئاوابوون',
    next24Hours: '٢٤ کاتژمێری داهاتوو',
    next24HoursHint: 'هەر کاتژمێرێک هەڵبژێرە بۆ بینینی پلەی گەرمی و ئەگەری باران',
    now: 'ئێستا',
    outlook7Day: 'پێشبینی ٧ ڕۆژ',
    outlook7DayHint: 'کلیک لە هەر ڕۆژێک بکە بۆ بینینی خۆرهەڵاتن، باران و وردەکاریی با',
    precipitation: 'بارین',
    maxWind: 'بەرزترین با',
    peakUv: 'بەرزترین UV',
    sunriseSunset: 'خۆرهەڵاتن / خۆرئاوابوون',
    toWord: 'بۆ',
    today: 'ئەمڕۆ',
    tomorrow: 'سبەی',
    weekdays: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'],
    months: ['کانوونی ٢', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمموز', 'ئاب', 'ئەیلوول', 'تشرینی ١', 'تشرینی ٢', 'کانوونی ١'],
    uvLevels: {
      low: 'نزم',
      moderate: 'مامناوەند',
      high: 'بەرز',
      veryHigh: 'زۆر بەرز',
      extreme: 'زۆر توند',
    },
    compass: ['با', 'با-ڕهـ', 'با-ڕهـ', 'ڕهـ-با', 'ڕهـ', 'ڕهـ-بش', 'بش-ڕهـ', 'بش-ڕهـ', 'بش', 'بش-ڕا', 'بش-ڕا', 'ڕا-بش', 'ڕا', 'ڕا-با', 'با-ڕا', 'با-ڕا'],
    geolocationUnsupported: 'دیاریکردنی شوێن لەم وێبگەڕەدا پشتگیری ناکرێت. لە سەرەوە بۆ شارێک بگەڕێ.',
    geolocationDenied: 'ڕێگەپێدانی شوێن ڕەتکرایەوە. لە سەرەوە بۆ شارێک بگەڕێ.',
    geolocationFailed: 'نەتوانرا شوێنی ئێستات بدۆزرێتەوە. لە سەرەوە بۆ شارێک بگەڕێ.',
    reverseLookupFailed: 'نەتوانرا ناوی شوێنەکەت بزانرێت.',
    weatherLoadError: 'نەتوانرا زانیاری کەشوهەوای ڕاستەوخۆ بهێنرێت. تکایە پەیوەندییەکەت بپشکنە و دووبارە هەوڵبدەرەوە.',
    unableToLoadTitle: 'کەشوهەوا بار نەکرا',
    tryAgain: 'دووبارە هەوڵبدەرەوە',
    retry: 'دووبارە',
    dismissNotice: 'داخستنی ئاگاداری',
    dataAttribution: 'زانیاری کەشوهەوای ڕاستەوخۆ لەلایەن',
    elevation: 'بەرزی',
    settings: 'ڕێکخستنەکان',
    appearance: 'ڕووکار',
    autoMode: 'خۆکار',
    autoModeHint: 'بە شێوەیەکی خۆکار لە نێوان ڕووناک و تاریکدا دەگۆڕێت بەپێی ڕۆژ و شەوی شوێنی هەڵبژێردراو.',
    lightMode: 'ڕووناک',
    darkMode: 'تاریک',
    language: 'زمان',
    units: 'یەکەکان',
    metricUnit: 'سیلیزی · کم/ک',
    imperialUnit: 'فەهرەنهایت · میل/ک',
    close: 'داخستن',
    unitLabels: {
      kmh: 'کم/ک',
      mph: 'میل/ک',
      km: 'کم',
      mi: 'میل',
      mm: 'ملم',
      hpa: 'hPa',
      m: 'م',
    },
  },
};

export function translateWeatherCode(
  code: number,
  lang: LanguageCode,
  fallback: WeatherConditionMeta,
): { label: string; shortLabel: string } {
  if (lang === 'en') {
    return { label: fallback.label, shortLabel: fallback.shortLabel };
  }

  const arMap: Record<number, { label: string; shortLabel: string }> = {
    0: { label: 'ئەسمانێ ساهی', shortLabel: 'ساهی' },
    1: { label: 'پتریا دەمان ساهی', shortLabel: 'نیمچە ساهی' },
    2: { label: 'پشکەک عەور', shortLabel: 'عەور و هەتاڤ' },
    3: { label: 'تەمام عەور', shortLabel: 'عەور' },
    45: { label: 'مژ', shortLabel: 'مژ' },
    48: { label: 'مژ و بەستەلەک', shortLabel: 'مژ' },
    51: { label: 'هویرە بارانا سڤک', shortLabel: 'هویرە باران' },
    53: { label: 'هویرە باران', shortLabel: 'هویرە باران' },
    55: { label: 'هویرە بارانا خورت', shortLabel: 'هویرە باران' },
    56: { label: 'هویرە بارانا بەستەلەک', shortLabel: 'بارانا بەستەلەک' },
    57: { label: 'هویرە بارانا بەستەلەک', shortLabel: 'بارانا بەستەلەک' },
    61: { label: 'بارانا سڤک', shortLabel: 'باران' },
    63: { label: 'باران', shortLabel: 'باران' },
    65: { label: 'بارانا خورت', shortLabel: 'بارانا خورت' },
    66: { label: 'بارانا بەستەلەک', shortLabel: 'بارانا بەستەلەک' },
    67: { label: 'بارانا بەستەلەک', shortLabel: 'بارانا بەستەلەک' },
    71: { label: 'بەفرا سڤک', shortLabel: 'بەفر' },
    73: { label: 'بەفر', shortLabel: 'بەفر' },
    75: { label: 'بەفرا خورت', shortLabel: 'بەفرا خورت' },
    77: { label: 'بەفرا هویر', shortLabel: 'بەفر' },
    80: { label: 'تاڤێن بارانێ', shortLabel: 'تاڤ باران' },
    81: { label: 'تاڤێن بارانێ', shortLabel: 'تاڤ باران' },
    82: { label: 'تاڤێن بارانا خورت', shortLabel: 'تاڤ باران' },
    85: { label: 'تاڤێن بەفرێ', shortLabel: 'تاڤ بەفر' },
    86: { label: 'تاڤێن بەفرێ', shortLabel: 'تاڤ بەفر' },
    95: { label: 'بروسی و باران', shortLabel: 'بروسک' },
    96: { label: 'بروسی و تەرزە', shortLabel: 'تەرزە' },
    99: { label: 'بروسی و تەرزە', shortLabel: 'تەرزە' },
  };

  const laMap: Record<number, { label: string; shortLabel: string }> = {
    0: { label: 'Esmanê sahî', shortLabel: 'Sahî' },
    1: { label: 'Pitriya deman sahî', shortLabel: 'Nîmçe sahî' },
    2: { label: 'Pişkek ewr', shortLabel: 'Ewr û hetav' },
    3: { label: 'Temam ewr', shortLabel: 'Ewr' },
    45: { label: 'Mij', shortLabel: 'Mij' },
    48: { label: 'Mij û bestelek', shortLabel: 'Mij' },
    51: { label: 'Hûre barana sivik', shortLabel: 'Hûre baran' },
    53: { label: 'Hûre baran', shortLabel: 'Hûre baran' },
    55: { label: 'Hûre barana xurt', shortLabel: 'Hûre baran' },
    56: { label: 'Hûre barana bestelek', shortLabel: 'Barana bestelek' },
    57: { label: 'Hûre barana bestelek', shortLabel: 'Barana bestelek' },
    61: { label: 'Barana sivik', shortLabel: 'Baran' },
    63: { label: 'Baran', shortLabel: 'Baran' },
    65: { label: 'Barana xurt', shortLabel: 'Barana xurt' },
    66: { label: 'Barana bestelek', shortLabel: 'Barana bestelek' },
    67: { label: 'Barana bestelek', shortLabel: 'Barana bestelek' },
    71: { label: 'Befra sivik', shortLabel: 'Befr' },
    73: { label: 'Befr', shortLabel: 'Befr' },
    75: { label: 'Befra xurt', shortLabel: 'Befra xurt' },
    77: { label: 'Befra hûr', shortLabel: 'Befr' },
    80: { label: 'Tavên baranê', shortLabel: 'Tav baran' },
    81: { label: 'Tavên baranê', shortLabel: 'Tav baran' },
    82: { label: 'Tavên barana xurt', shortLabel: 'Tav baran' },
    85: { label: 'Tavên befrê', shortLabel: 'Tav befr' },
    86: { label: 'Tavên befrê', shortLabel: 'Tav befr' },
    95: { label: 'Brûsî û baran', shortLabel: 'Brûsk' },
    96: { label: 'Brûsî û terze', shortLabel: 'Terze' },
    99: { label: 'Brûsî û terze', shortLabel: 'Terze' },
  };

  const soMap: Record<number, { label: string; shortLabel: string }> = {
    0: { label: 'ئاسمانی ساماڵ', shortLabel: 'ساماڵ' },
    1: { label: 'زۆربەی کات ساماڵ', shortLabel: 'نیمچە ساماڵ' },
    2: { label: 'کەمێک هەور', shortLabel: 'هەور و خۆر' },
    3: { label: 'هەوراوی تەواو', shortLabel: 'هەوراوی' },
    45: { label: 'تەم', shortLabel: 'تەم' },
    48: { label: 'تەم و شەختە', shortLabel: 'تەم' },
    51: { label: 'نمەبارانی سووک', shortLabel: 'نمەباران' },
    53: { label: 'نمەباران', shortLabel: 'نمەباران' },
    55: { label: 'نمەبارانی بەهێز', shortLabel: 'نمەباران' },
    56: { label: 'نمەبارانی بەستوو', shortLabel: 'بارانی بەستوو' },
    57: { label: 'نمەبارانی بەستوو', shortLabel: 'بارانی بەستوو' },
    61: { label: 'بارانی سووک', shortLabel: 'باران' },
    63: { label: 'باران', shortLabel: 'باران' },
    65: { label: 'بارانی بەلێزمە', shortLabel: 'بارانی بەهێز' },
    66: { label: 'بارانی بەستوو', shortLabel: 'بارانی بەستوو' },
    67: { label: 'بارانی بەستوو', shortLabel: 'بارانی بەستوو' },
    71: { label: 'بەفری سووک', shortLabel: 'بەفر' },
    73: { label: 'بەفر', shortLabel: 'بەفر' },
    75: { label: 'بەفری زۆر', shortLabel: 'بەفری زۆر' },
    77: { label: 'دەنکە بەفر', shortLabel: 'بەفر' },
    80: { label: 'تاوەباران', shortLabel: 'تاوەباران' },
    81: { label: 'تاوەباران', shortLabel: 'تاوەباران' },
    82: { label: 'تاوەبارانی بەهێز', shortLabel: 'تاوەباران' },
    85: { label: 'تاوەبەفر', shortLabel: 'تاوەبەفر' },
    86: { label: 'تاوەبەفر', shortLabel: 'تاوەبەفر' },
    95: { label: 'بروسکە و باران', shortLabel: 'بروسکە' },
    96: { label: 'بروسکە و تەرزە', shortLabel: 'تەرزە' },
    99: { label: 'بروسکە و تەرزە', shortLabel: 'تەرزە' },
  };

  if (lang === 'ku-ba-ar') {
    return arMap[code] ?? { label: 'گوهۆڕبار', shortLabel: 'گوهۆڕبار' };
  }
  if (lang === 'ku-so') {
    return soMap[code] ?? { label: 'گۆڕاو', shortLabel: 'گۆڕاو' };
  }
  return laMap[code] ?? { label: 'Guhorbar', shortLabel: 'Guhorbar' };
}

export function formatLocalizedDayLabel(
  dateStr: string,
  index: number,
  lang: LanguageCode,
): { dayName: string; shortDate: string } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const t = TRANSLATIONS[lang];

  const shortDate = `${t.months[utcDate.getUTCMonth()]} ${utcDate.getUTCDate()}`;
  if (index === 0) return { dayName: t.today, shortDate };
  if (index === 1) return { dayName: t.tomorrow, shortDate };

  const dayName = t.weekdays[utcDate.getUTCDay()];
  return { dayName, shortDate };
}

export function localizeUvLabel(uv: number, lang: LanguageCode): string {
  const levels = TRANSLATIONS[lang].uvLevels;
  if (uv < 3) return levels.low;
  if (uv < 6) return levels.moderate;
  if (uv < 8) return levels.high;
  if (uv < 11) return levels.veryHigh;
  return levels.extreme;
}

export function localizeCompass(degrees: number, lang: LanguageCode): string {
  const dirs = TRANSLATIONS[lang].compass;
  const index = Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16;
  return dirs[index];
}

export function localizePresetCityName(id: string, fallbackName: string, lang: LanguageCode): string {
  if (lang === 'en') return fallbackName;

  const arNames: Record<string, string> = {
    '98463': 'دهۆک',
    '5391959': 'سان فرانسیسکۆ',
    '5128581': 'نیویۆرک',
    '2643743': 'لەندەن',
    '1850147': 'تۆکیۆ',
  };
  const laNames: Record<string, string> = {
    '98463': 'Duhok',
    '5391959': 'San Francisco',
    '5128581': 'New York',
    '2643743': 'London',
    '1850147': 'Tokyo',
  };

  const soNames: Record<string, string> = {
    '98463': 'دهۆک',
    '5391959': 'سان فرانسیسکۆ',
    '5128581': 'نیویۆرک',
    '2643743': 'لەندەن',
    '1850147': 'تۆکیۆ',
  };

  if (lang === 'ku-ba-ar') return arNames[id] ?? fallbackName;
  if (lang === 'ku-so') return soNames[id] ?? fallbackName;
  return laNames[id] ?? fallbackName;
}
