/*
 * Marketplace specific configuration.
 *
 * Every filter needs to have following keys:
 * - id:     Unique id of the filter.
 * - label:  The default label of the filter.
 * - type:   String that represents one of the existing filter components:
 *           BookingDateRangeFilter, KeywordFilter, PriceFilter,
 *           SelectSingleFilter, SelectMultipleFilter.
 * - group:  Is this 'primary' or 'secondary' filter?
 *           Primary filters are visible on desktop layout by default.
 *           Secondary filters are behind "More filters" button.
 *           Read more from src/containers/SearchPage/README.md
 * - queryParamNames: Describes parameters to be used with queries
 *                    (e.g. 'price' or 'pub_amenities'). Most of these are
 *                    the same between webapp URLs and API query params.
 *                    You can't change 'dates', 'price', or 'keywords'
 *                    since those filters are fixed to a specific attribute.
 * - config: Extra configuration that the filter component needs.
 *
 * Note 1: Labels could be tied to translation file
 *         by importing FormattedMessage:
 *         <FormattedMessage id="some.translation.key.here" />
 *
 * Note 2: If you need to add new custom filter components,
 *         you need to take those into use in:
 *         src/containers/SearchPage/FilterComponent.js
 *
 * Note 3: If you just want to create more enum filters
 *         (i.e. SelectSingleFilter, SelectMultipleFilter),
 *         you can just add more configurations with those filter types
 *         and tie them with correct extended data key
 *         (i.e. pub_<key> or meta_<key>).
 */

export const filters = [

  // # ------------------------------------------------------------------------- #
  //
  //    CAUTION the data structure should be the right one enum => '', multi-enum => []
  //    CHECK src/containers/EditListingPage/EditListingWizard/EditListingDetailsPanel/EditListingDetailsPanel.js
  //
  // # ------------------------------------------------------------------------- #

  // # Restaurant filter ------------------------------------------------------- #
  {
    id: 'restaurant',
    label: 'Restaurant',
    type: 'SelectSingleFilter',
    group: 'primary',
    queryParamNames: ['pub_restaurant'],
    config: {
      // Schema type options: 'enum', 'multi-enum'
      // Both types can work so that user selects multiple values when filtering search results.
      // With "enum" the functionality will be OR-semantics (Nike OR Adidas OR Salomon)
      // With "multi-enum" it's possible to use both AND and OR semantics with searchMode config.
      schemaType: 'enum',

      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'fox-ginger', label: 'Fox & Ginger' },
        { key: 'legumes-et-vie', label: 'Légumes et Vie' },
        { key: 'albert-cookies', label: 'Albert Cookies' },
        { key: 'made-in-les-arcs', label: 'Made in Les Arcs' },
        { key: 'fondus-de-ski', label: 'Fondus de Ski' },
        { key: 'mountain-cake', label: 'Mountain Cake' },
        { key: 'green-and-good', label: 'Green And Good' },
        { key: 'soups-smoothies', label: 'Soups & Smoothies' },
        // { key: 'le-regal-de-veggie', label: 'Le Régal de Veggie' },
        { key: 'veggielesarcs', label: 'VeggieLesArcs' },
        { key: 'arcosushis', label: 'ArcOsushis' },     
        { key: 'team-marmott', label: "Team Marmott'" },  
        { key: 'pizza-el-hierro', label: "Pizza El Hierro" },        
      ],
    },
  },
  // # Food type filter -------------------------------------------------------- #
  {
    id: 'foodType',
    label: 'Plat & en-cas',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_foodType'],
    config: {
      schemaType: 'enum',
      searchMode: 'has_any',
      options: [
        { key: 'burger', label: 'Burger' },
        { key: 'pizza', label: 'Pizza' },
        { key: 'kebab', label: 'Kebab' },
        { key: 'salad', label: 'Salade' },
        { key: 'sandwich', label: 'Sandwich' },
        { key: 'fries', label: 'Frites' },
        { key: 'deli', label: 'Charcuterie & fromage' },
        { key: 'soup', label: 'Soupe' },
        { key: 'waffels', label: 'Gauffre & crêpe' },
        { key: 'pastry', label: 'Viennoiserie & Pâtisserie' },
        { key: 'bread', label: 'Pain' },
        { key: 'other_dish', label: 'Autre plat' },
      ],
    },
  },
  // # Product type filter ----------------------------------------------------- #
  {
    id: 'productType',
    label: 'Salé, sucré, menu',
    // TODO put back SelectSingleFilter if sections in all meals / restaurant's page
    // And if UX not Ok
    // type: 'SelectSingleFilter',    
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_productType'],
    config: {
      schemaType: 'enum',
      options: [
        { key: 'eatable_salty', label: 'Salé' },
        { key: 'eatable_sweet', label: 'Sucré' },        
        { key: 'drinkable', label: 'Boisson' },
        { key: 'composable', label: 'Menu' }
      ],
    },
  },
  // # Cuisine filter ---------------------------------------------------------- #
  {
    id: 'cuisine',
    label: 'Cuisine',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_cuisine'],
    config: {
      schemaType: 'enum',
      searchMode: 'has_any',
      options: [
        { key: 'local', label: 'Locale, savoyarde' },
        { key: 'french', label: 'Autre française' },
        { key: 'italian', label: 'Italienne' },
        { key: 'asian', label: 'Asiatique' },
        { key: 'us', label: 'Américaine' },
        // { key: 'mexican', label: 'Mexicaine' },
        { key: 'other', label: 'Autre' },
      ],
    },
  },
  // # Food type filter -------------------------------------------------------- #
  {
    id: 'diet',
    label: 'Régime alimentaire',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_diet'],
    config: {
      schemaType: 'multi-enum',
      searchMode: 'has_any',
      options: [
        { key: 'bio', label: 'Label AB - Bio' },
        { key: 'veggie', label: 'Végétarien' },
        { key: 'vegan', label: 'Végan' },
        { key: 'halal', label: 'Halal' },
        // Added allergens
        { key: 'gluten_free', label: 'Sans gluten' },
        { key: 'lactose_free', label: 'Sans lactose' }
      ],
    },
  },
  // # Allergen filter -------------------------------------------------------- #
  // {
  //   id: 'allergen',
  //   label: 'Allergènes',
  //   type: 'SelectMultipleFilter',
  //   group: 'secondary',
  //   queryParamNames: ['pub_allergen'],
  //   config: {
  //     schemaType: 'multi-enum',
  //     searchMode: 'has_any',
  //     options: [
  //       { key: 'gluten_free', label: 'Sans gluten' },
  //       { key: 'lactose_free', label: 'Sans lactose' }        
  //     ],
  //   },
  // },
  // # Drink filter ---------------------------------------------------------- #
  {
    id: 'drinkType',
    label: 'Boisson',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_drinkType'],
    config: {
      schemaType: 'enum',
      searchMode: 'has_any',
      options: [
        { key: 'soda', label: 'Soda' },
        { key: 'water', label: 'Eau' },
        { key: 'juice', label: 'Jus de fruits' },
        { key: 'smoothie', label: 'Smoothie' },        
        { key: 'tea', label: 'Thé' },
        { key: 'coffee', label: 'Café' },
        { key: 'milk_based', label: 'A base de lait' },
      ],
    },
  },
  // # Meal type filter -------------------------------------------------------- #
  // {
  //   id: 'mealType',
  //   label: 'Type de repas',
  //   type: 'SelectMultipleFilter',
  //   group: 'secondary',
  //   queryParamNames: ['pub_mealType'],
  //   config: {
  //     schemaType: 'enum',
  //     searchMode: 'has_any',
  //     options: [
  //       { key: 'breakfast', label: 'Petit-déjeûner' },
  //       { key: 'apetizer', label: 'Apéritif' },
  //       { key: 'starter', label: 'Entrée' },
  //       { key: 'main_dish', label: 'Plat principal' },    
  //       { key: 'snack', label: 'En-cas' },
  //       { key: 'dessert', label: 'Dessert' },
  //     ],
  //   },
  // },  
  // # Size filter ------------------------------------------------------------- #
  {
    id: 'size',
    label: 'Tailles existantes',
    type: 'SelectSingleFilter',
    group: 'secondary',
    queryParamNames: ['pub_size'],
    config: {
      schemaType: 'multi-enum',
      searchMode: 'has_any',
      options: [
        { key: 'small', label: 'Petit' },
        { key: 'medium', label: 'Moyen' },
        { key: 'large', label: 'Grand' },
        { key: 'xlarge', label: 'XL' },
      ],
    },
  },
  // # Price filter ------------------------------------------------------------ #
  {
    id: 'price',
    label: 'Prix',
    type: 'PriceFilter',
    group: 'primary',
    // Note: PriceFilter is fixed filter,
    // you can't change "queryParamNames: ['price'],"
    queryParamNames: ['price'],
    // Price filter configuration
    // Note: unlike most prices this is not handled in subunits
    config: {
      min: 0,
      max: 100,
      step: 10,
    },
  },
  // # Keyword search ---------------------------------------------------------- #
  {
    id: 'keyword',
    label: 'Mot-clef',
    type: 'KeywordFilter',
    group: 'primary',
    // Note: KeywordFilter is fixed filter,
    // you can't change "queryParamNames: ['keywords'],"
    queryParamNames: ['keywords'],
    // NOTE: If you are ordering search results by distance
    // the keyword search can't be used at the same time.
    // You can turn on/off ordering by distance from config.js file.
    config: {},
  },

  // # ------------------------------------------------------------------------- #

  /*
  // Here is an example of multi-enum search filter.
  {
    id: 'amenities',
    label: 'Amenities',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_amenities'],
    config: {
      // Schema type options: 'enum', 'multi-enum'
      // Both types can work so that user selects multiple values when filtering search results.
      // With "enum" the functionality will be OR-semantics (Nike OR Adidas OR Salomon)
      // With "multi-enum" it's possible to use both AND and OR semantics with searchMode config.
      schemaType: 'multi-enum',

      // Optional modes: 'has_all', 'has_any'
      // Note: this is relevant only for schema type 'multi-enum'
      // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
      searchMode: 'has_all',

      // "key" is the option you see in Flex Console.
      // "label" is set here for this web app's UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'towels', label: 'Towels' },
        { key: 'bathroom', label: 'Bathroom' },
        { key: 'swimming_pool', label: 'Swimming pool' },
        { key: 'barbeque', label: 'Barbeque' },
      ],
    },
  },
  */
  // # ------------------------------------------------------------------------- #
];

export const sortConfig = {
  // Enable/disable the sorting control in the SearchPage
  active: true,

  // Note: queryParamName 'sort' is fixed,
  // you can't change it since Flex API expects it to be named as 'sort'
  queryParamName: 'sort',

  // Internal key for the relevance option, see notes below.
  relevanceKey: 'relevance',

  // Relevance key is used with keywords filter.
  // Keywords filter also sorts results according to relevance.
  relevanceFilter: 'keywords',

  // Keyword filter is sorting the results by relevance.
  // If keyword filter is active, one might want to disable other sorting options
  // by adding 'keyword' to this list.
  conflictingFilters: [],

  options: [
    { key: 'createdAt', label: 'Plus récent en premier' },
    { key: '-createdAt', label: 'Plus ancien en premier' },
    { key: '-price', label: 'Prix le plus bas en premier' },
    { key: 'price', label: 'Prix le plus haut en premier' },

    // The relevance is only used for keyword search, but the
    // parameter isn't sent to the Marketplace API. The key is purely
    // for handling the internal state of the sorting dropdown.
    { key: 'relevance', label: 'Pertinence', longLabel: 'Pertinence (Recherche par mot-clef)' },
  ],
};

// This will determine the data output on he LISTING PAGE 
export const listing = {
  // These should be listing details from public data with schema type: enum
  // SectionDetailsMaybe component shows these on LISTING page.
  // enumFieldDetails: ['foodType', 'cuisine', 'diet', 'size' ],  
  enumFieldDetails: ['cuisine', 'mealType', 'foodType', 'drinkType', 'diet', 'allergen', 'size'],
  // enumFieldDetails: ['productType', 'cuisine', 'mealType', 'foodType', 'drinkType', 'diet', 'allergen', 'size'],
};
