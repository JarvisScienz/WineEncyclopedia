export interface SchemaOption {
  value: string;
  label: string;
}

export interface TastingSchemaConfig {
  options: {
    color: SchemaOption[];
    chromaticDensity: SchemaOption[];
    clarity: SchemaOption[];
    consistency: SchemaOption[];
    effervescenceBubbleGrain: SchemaOption[];
    effervescenceBubbleNumber: SchemaOption[];
    effervescenceBubblePersistence: SchemaOption[];
    effervescenceSpeed: SchemaOption[];
    olfactoryIntensity: SchemaOption[];
    olfactoryComplexity: SchemaOption[];
    olfactoryQuality: SchemaOption[];
    olfactorySense: SchemaOption[];
    sweetness: SchemaOption[];
    alcohol: SchemaOption[];
    polyalcohols: SchemaOption[];
    acidity: SchemaOption[];
    tanninsQuantity: SchemaOption[];
    tanninsQuality: SchemaOption[];
    mineralSubstances: SchemaOption[];
    gustatoryEffervescence: SchemaOption[];
    tasteIntensity: SchemaOption[];
    body: SchemaOption[];
    balance: SchemaOption[];
    tastePersistence: SchemaOption[];
    tasteQuality: SchemaOption[];
    evolution: SchemaOption[];
    harmony: SchemaOption[];
    finalQuality: SchemaOption[];
  };
  labels: {
    finalQuality: string;
    tannin: string;
    polyalcohols: string;
    mineralSubstances: string;
  };
  showFields: {
    hasChromaticDensity: boolean;
    hasTanninQuality: boolean;
    hasEffervescenceSpeed: boolean;
    hasGustatoryEffervescence: boolean;
  };
}

export const FIS_SCHEMA: TastingSchemaConfig = {
  options: {
    color: [
      { value: 'yellow_greenish', label: 'Giallo verdolino' },
      { value: 'yellow_straw', label: 'Giallo paglierino' },
      { value: 'yellow_golden', label: 'Giallo dorato' },
      { value: 'yellow_amber', label: 'Giallo ambrato/aranciato' },
      { value: 'rose_soft', label: 'Rosa tenue' },
      { value: 'rose_coppery', label: 'Rosa ramato' },
      { value: 'rose_cherry', label: 'Rosa cerasuolo' },
      { value: 'rose_claret', label: 'Rosa chiaretto' },
      { value: 'red_purplish', label: 'Rosso porpora/violaceo' },
      { value: 'red_ruby', label: 'Rosso rubino' },
      { value: 'red_garnet', label: 'Rosso granato' },
      { value: 'red_orange', label: 'Rosso aranciato' },
    ],
    chromaticDensity: [
      { value: 'Trasparente', label: 'Trasparente' },
      { value: 'Sufficientemente trasparente', label: 'Sufficientemente trasparente' },
      { value: 'Poco trasparente', label: 'Poco trasparente' },
      { value: 'Compatto', label: 'Compatto' },
    ],
    clarity: [
      { value: 'Velato', label: 'Velato' },
      { value: 'Sufficientemente velato', label: 'Sufficientemente velato' },
      { value: 'Limpido', label: 'Limpido' },
      { value: 'Brillante', label: 'Brillante' },
    ],
    consistency: [
      { value: 'Poco consistente', label: 'Poco consistente' },
      { value: 'Consistente', label: 'Consistente' },
      { value: 'Denso', label: 'Denso' },
      { value: 'Viscoso', label: 'Viscoso' },
    ],
    effervescenceBubbleGrain: [
      { value: 'Fini', label: 'Fini' },
      { value: 'Grossolane', label: 'Grossolane' },
    ],
    effervescenceBubbleNumber: [
      { value: 'Numerose', label: 'Numerose' },
      { value: 'Scarse', label: 'Scarse' },
    ],
    effervescenceBubblePersistence: [
      { value: 'Persistenti', label: 'Persistenti' },
      { value: 'Evanescenti', label: 'Evanescenti' },
    ],
    effervescenceSpeed: [],
    olfactoryIntensity: [
      { value: 'Poco intenso', label: 'Poco intenso' },
      { value: 'Sufficientemente intenso', label: 'Sufficientemente intenso' },
      { value: 'Intenso', label: 'Intenso' },
      { value: 'Molto intenso', label: 'Molto intenso' },
    ],
    olfactoryComplexity: [
      { value: 'Poco complesso', label: 'Poco complesso' },
      { value: 'Sufficientemente complesso', label: 'Sufficientemente complesso' },
      { value: 'Complesso', label: 'Complesso' },
      { value: 'Ampio', label: 'Ampio' },
    ],
    olfactoryQuality: [
      { value: 'Poco fine', label: 'Poco fine' },
      { value: 'Sufficientemente fine', label: 'Sufficientemente fine' },
      { value: 'Fine', label: 'Fine' },
      { value: 'Eccellente', label: 'Eccellente' },
    ],
    olfactorySense: [
      { value: 'Aromatico', label: 'Aromatico' },
      { value: 'Vinoso', label: 'Vinoso' },
      { value: 'Floreale', label: 'Floreale' },
      { value: 'Fruttato', label: 'Fruttato' },
      { value: 'Fragrante', label: 'Fragrante' },
      { value: 'Vegetale', label: 'Vegetale' },
      { value: 'Balsamico', label: 'Balsamico' },
      { value: 'Minerale', label: 'Minerale' },
      { value: 'Etereo', label: 'Etereo' },
      { value: 'Speziato', label: 'Speziato' },
      { value: 'Frutta secca', label: 'Frutta secca' },
      { value: 'Frutta disidratata', label: 'Frutta disidratata' },
      { value: 'Tostato', label: 'Tostato' },
      { value: 'Animale', label: 'Animale' },
      { value: 'Selvatico', label: 'Selvatico' },
    ],
    sweetness: [
      { value: 'Secco', label: 'Secco' },
      { value: 'Amabile', label: 'Amabile' },
      { value: 'Dolce', label: 'Dolce' },
      { value: 'Stucchevole', label: 'Stucchevole' },
    ],
    alcohol: [
      { value: 'Poco caldo', label: 'Poco caldo' },
      { value: 'Moderatamente caldo', label: 'Moderatamente caldo' },
      { value: 'Caldo', label: 'Caldo' },
      { value: 'Molto caldo', label: 'Molto caldo' },
    ],
    polyalcohols: [
      { value: 'Poco morbido', label: 'Poco morbido' },
      { value: 'Moderatamente morbido', label: 'Moderatamente morbido' },
      { value: 'Morbido', label: 'Morbido' },
      { value: 'Rotondo', label: 'Rotondo' },
    ],
    acidity: [
      { value: 'Poco fresco', label: 'Poco fresco' },
      { value: 'Moderatamente fresco', label: 'Moderatamente fresco' },
      { value: 'Fresco', label: 'Fresco' },
      { value: 'Molto fresco', label: 'Molto fresco' },
    ],
    tanninsQuantity: [
      { value: 'Poco tannico', label: 'Poco tannico' },
      { value: 'Moderatamente tannico', label: 'Moderatamente tannico' },
      { value: 'Tannico', label: 'Tannico' },
      { value: 'Molto tannico', label: 'Molto tannico' },
    ],
    tanninsQuality: [
      { value: 'Grossolano', label: 'Grossolano' },
      { value: 'Duro', label: 'Duro' },
      { value: 'Vellutato', label: 'Vellutato' },
      { value: 'Nobile', label: 'Nobile' },
    ],
    mineralSubstances: [
      { value: 'Poco sapido', label: 'Poco sapido' },
      { value: 'Moderatamente sapido', label: 'Moderatamente sapido' },
      { value: 'Sapido', label: 'Sapido' },
      { value: 'Salato', label: 'Salato' },
    ],
    gustatoryEffervescence: [],
    tasteIntensity: [
      { value: 'Poco intenso', label: 'Poco intenso' },
      { value: 'Sufficientemente intenso', label: 'Sufficientemente intenso' },
      { value: 'Intenso', label: 'Intenso' },
      { value: 'Molto intenso', label: 'Molto intenso' },
    ],
    body: [
      { value: 'Leggero', label: 'Leggero' },
      { value: 'Medio', label: 'Medio' },
      { value: 'Pieno', label: 'Pieno' },
      { value: 'Pesante', label: 'Pesante' },
    ],
    balance: [
      { value: 'Sbilanciato', label: 'Sbilanciato' },
      { value: 'Poco equilibrato', label: 'Poco equilibrato' },
      { value: 'Sufficientemente equilibrato', label: 'Sufficientemente equilibrato' },
      { value: 'Equilibrato', label: 'Equilibrato' },
    ],
    tastePersistence: [
      { value: 'Poco persistente', label: 'Poco persistente' },
      { value: 'Sufficientemente persistente', label: 'Sufficientemente persistente' },
      { value: 'Persistente', label: 'Persistente' },
      { value: 'Molto persistente', label: 'Molto persistente' },
    ],
    tasteQuality: [
      { value: 'Poco fine', label: 'Poco fine' },
      { value: 'Sufficientemente fine', label: 'Sufficientemente fine' },
      { value: 'Fine', label: 'Fine' },
      { value: 'Eccellente', label: 'Eccellente' },
    ],
    evolution: [
      { value: 'Giovane', label: 'Giovane' },
      { value: 'Pronto', label: 'Pronto' },
      { value: 'Maturo', label: 'Maturo' },
      { value: 'Vecchio', label: 'Vecchio' },
    ],
    harmony: [
      { value: 'Disarmonico', label: 'Disarmonico' },
      { value: 'Poco armonico', label: 'Poco armonico' },
      { value: 'Sufficientemente armonico', label: 'Sufficientemente armonico' },
      { value: 'Armonico', label: 'Armonico' },
    ],
    finalQuality: [
      { value: 'Poco tipico', label: 'Poco tipico' },
      { value: 'Sufficientemente tipico', label: 'Sufficientemente tipico' },
      { value: 'Tipico', label: 'Tipico' },
      { value: 'Esemplare', label: 'Esemplare' },
    ],
  },
  labels: {
    finalQuality: 'Tipicità',
    tannin: 'Tannino',
    polyalcohols: 'Polialcoli',
    mineralSubstances: 'Sostanze minerali',
  },
  showFields: {
    hasChromaticDensity: true,
    hasTanninQuality: true,
    hasEffervescenceSpeed: false,
    hasGustatoryEffervescence: false,
  },
};

export const AIS_SCHEMA: TastingSchemaConfig = {
  options: {
    color: [
      { value: 'white_verdolino', label: 'Bianco verdolino' },
      { value: 'white_paglierino', label: 'Bianco paglierino' },
      { value: 'white_dorato', label: 'Bianco dorato' },
      { value: 'white_ambrato', label: 'Bianco ambrato' },
      { value: 'white_mogano', label: 'Bianco mogano' },
      { value: 'rose_fioreDiPesco', label: 'Rosa fiore di pesco' },
      { value: 'rose_ramato', label: 'Rosa ramato' },
      { value: 'rose_salmone', label: 'Rosa salmone' },
      { value: 'rose_corallo', label: 'Rosa corallo' },
      { value: 'rose_peonia', label: 'Rosa peonia' },
      { value: 'red_amaranto', label: 'Rosso amaranto' },
      { value: 'red_rubino', label: 'Rosso rubino' },
      { value: 'red_carminio', label: 'Rosso carminio' },
      { value: 'red_granato', label: 'Rosso granato' },
      { value: 'red_aranciato', label: 'Rosso aranciato' },
    ],
    chromaticDensity: [],
    clarity: [
      { value: 'Velato', label: 'Velato' },
      { value: 'Abbastanza limpido', label: 'Abbastanza limpido' },
      { value: 'Limpido', label: 'Limpido' },
      { value: 'Cristallino', label: 'Cristallino' },
      { value: 'Brillante', label: 'Brillante' },
    ],
    consistency: [
      { value: 'Scorrevole', label: 'Scorrevole' },
      { value: 'Consistente', label: 'Consistente' },
      { value: 'Viscoso', label: 'Viscoso' },
    ],
    effervescenceBubbleGrain: [
      { value: 'Grossolane', label: 'Grossolane' },
      { value: 'Mediamente fini', label: 'Mediamente fini' },
      { value: 'Fini', label: 'Fini' },
    ],
    effervescenceBubbleNumber: [
      { value: 'Scarse', label: 'Scarse' },
      { value: 'Mediamente numerose', label: 'Mediamente numerose' },
      { value: 'Numerose', label: 'Numerose' },
    ],
    effervescenceBubblePersistence: [
      { value: 'Evanescenti', label: 'Evanescenti' },
      { value: 'Mediamente persistenti', label: 'Mediamente persistenti' },
      { value: 'Persistenti', label: 'Persistenti' },
    ],
    effervescenceSpeed: [
      { value: 'Rapida', label: 'Rapida' },
      { value: 'Media', label: 'Media' },
      { value: 'Lenta', label: 'Lenta' },
    ],
    olfactoryIntensity: [
      { value: 'Moderatamente intenso', label: 'Moderatamente intenso' },
      { value: 'Intenso', label: 'Intenso' },
      { value: 'Molto intenso', label: 'Molto intenso' },
    ],
    olfactoryComplexity: [
      { value: 'Moderatamente complesso', label: 'Moderatamente complesso' },
      { value: 'Complesso', label: 'Complesso' },
      { value: 'Ampio', label: 'Ampio' },
    ],
    olfactoryQuality: [
      { value: 'Accettabile', label: 'Accettabile' },
      { value: 'Buono', label: 'Buono' },
      { value: 'Distinto', label: 'Distinto' },
      { value: 'Ottimo', label: 'Ottimo' },
      { value: 'Eccellente', label: 'Eccellente' },
    ],
    olfactorySense: [
      { value: 'Aromatico', label: 'Aromatico' },
      { value: 'Floreale', label: 'Floreale' },
      { value: 'Speziato', label: 'Speziato' },
      { value: 'Varietale', label: 'Varietale' },
      { value: 'Vegetale', label: 'Vegetale' },
      { value: 'Pasticceria-Panificazione', label: 'Pasticceria-Panificazione' },
      { value: 'Fruttato', label: 'Fruttato' },
      { value: 'Fragrante', label: 'Fragrante' },
      { value: 'Empireumatico', label: 'Empireumatico' },
    ],
    sweetness: [
      { value: 'Secco', label: 'Secco' },
      { value: 'Poco dolce', label: 'Poco dolce' },
      { value: 'Moderatamente dolce', label: 'Moderatamente dolce' },
      { value: 'Dolce', label: 'Dolce' },
      { value: 'Molto dolce', label: 'Molto dolce' },
    ],
    alcohol: [
      { value: 'Poco caldo', label: 'Poco caldo' },
      { value: 'Moderatamente caldo', label: 'Moderatamente caldo' },
      { value: 'Caldo', label: 'Caldo' },
      { value: 'Molto caldo', label: 'Molto caldo' },
      { value: 'Alcolico', label: 'Alcolico' },
    ],
    polyalcohols: [
      { value: 'Poco morbido', label: 'Poco morbido' },
      { value: 'Moderatamente morbido', label: 'Moderatamente morbido' },
      { value: 'Morbido', label: 'Morbido' },
      { value: 'Vellutato', label: 'Vellutato' },
      { value: 'Pastoso', label: 'Pastoso' },
    ],
    acidity: [
      { value: 'Poco fresco', label: 'Poco fresco' },
      { value: 'Moderatamente fresco', label: 'Moderatamente fresco' },
      { value: 'Fresco', label: 'Fresco' },
      { value: 'Vibrante', label: 'Vibrante' },
      { value: 'Acidulo', label: 'Acidulo' },
    ],
    tanninsQuantity: [
      { value: 'Poco tannico', label: 'Poco tannico' },
      { value: 'Moderatamente tannico', label: 'Moderatamente tannico' },
      { value: 'Tannico', label: 'Tannico' },
      { value: 'Tenace', label: 'Tenace' },
      { value: 'Astringente', label: 'Astringente' },
    ],
    tanninsQuality: [],
    mineralSubstances: [
      { value: 'Poco sapido', label: 'Poco sapido' },
      { value: 'Moderatamente sapido', label: 'Moderatamente sapido' },
      { value: 'Sapido', label: 'Sapido' },
      { value: 'Saporito', label: 'Saporito' },
      { value: 'Salato', label: 'Salato' },
    ],
    gustatoryEffervescence: [
      { value: 'Delicata', label: 'Delicata' },
      { value: 'Moderata', label: 'Moderata' },
      { value: 'Vivace', label: 'Vivace' },
      { value: 'Esuberante', label: 'Esuberante' },
      { value: 'Incisiva', label: 'Incisiva' },
    ],
    tasteIntensity: [
      { value: 'Moderatamente intenso', label: 'Moderatamente intenso' },
      { value: 'Intenso', label: 'Intenso' },
      { value: 'Molto intenso', label: 'Molto intenso' },
    ],
    body: [
      { value: 'Di medio corpo', label: 'Di medio corpo' },
      { value: 'Di corpo pieno', label: 'Di corpo pieno' },
      { value: 'Robusto', label: 'Robusto' },
    ],
    balance: [
      { value: 'Poco equilibrato', label: 'Poco equilibrato' },
      { value: 'Mediamente equilibrato', label: 'Mediamente equilibrato' },
      { value: 'Equilibrato', label: 'Equilibrato' },
    ],
    tastePersistence: [
      { value: 'Moderatamente persistente', label: 'Moderatamente persistente' },
      { value: 'Persistente', label: 'Persistente' },
      { value: 'Molto persistente', label: 'Molto persistente' },
    ],
    tasteQuality: [
      { value: 'Accettabile', label: 'Accettabile' },
      { value: 'Buono', label: 'Buono' },
      { value: 'Distinto', label: 'Distinto' },
      { value: 'Ottimo', label: 'Ottimo' },
      { value: 'Eccellente', label: 'Eccellente' },
    ],
    evolution: [
      { value: 'Pronto', label: 'Pronto' },
      { value: 'Maturo', label: 'Maturo' },
    ],
    harmony: [
      { value: 'Poco armonico', label: 'Poco armonico' },
      { value: 'Mediamente armonico', label: 'Mediamente armonico' },
      { value: 'Armonico', label: 'Armonico' },
    ],
    finalQuality: [
      { value: 'Accettabile', label: 'Accettabile' },
      { value: 'Buono', label: 'Buono' },
      { value: 'Distinto', label: 'Distinto' },
      { value: 'Ottimo', label: 'Ottimo' },
      { value: 'Eccellente', label: 'Eccellente' },
    ],
  },
  labels: {
    finalQuality: 'Qualità complessiva',
    tannin: 'Tannicità',
    polyalcohols: 'Rotondità',
    mineralSubstances: 'Sapidità',
  },
  showFields: {
    hasChromaticDensity: false,
    hasTanninQuality: false,
    hasEffervescenceSpeed: true,
    hasGustatoryEffervescence: true,
  },
};

export const SCHEMAS: Record<'FIS' | 'AIS', TastingSchemaConfig> = {
  FIS: FIS_SCHEMA,
  AIS: AIS_SCHEMA,
};
