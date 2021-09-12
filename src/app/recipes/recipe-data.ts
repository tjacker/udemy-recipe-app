import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';

export const recipes: Recipe[] = [
  new Recipe(
    'Spare Ribs',
    'Dry rub spare ribs with salad',
    'https://www.simplyrecipes.com/thmb/Z1nIwZ6oMIwNcHZ8V0yZtzsXM6w=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2011__08__memphis-pork-ribs-horiz-a-1800-62bb309c1649417481d4e1a65ecb11ee.jpg',
    [
      new Ingredient('Pork ribs', 1),
      new Ingredient('Dry rub spices', 1),
      new Ingredient('Tomatoes', 2)
    ]
  ),
  new Recipe(
    'Beef Stew',
    'Slow cooker beef stew',
    'https://www.simplyrecipes.com/thmb/2Sm1eab6gpITB-JNORH6t6TIUkQ=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2017__11__2017-11-29-Pressure-Cooker-Beef-Stew-15-b06dff2cb17948c1ad61d96d6909e108.jpg',
    [new Ingredient('Stew beef', 1), new Ingredient('Potatoes', 3), new Ingredient('Carrots', 2)]
  ),
  new Recipe(
    'Pad Thai',
    'Noodles, egg, veggies, and bean sprouts',
    'https://www.simplyrecipes.com/thmb/cfr1gZnbSxDL_fY8y5OpL3eFu6g=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__03__Shrimp_Pad_Thai_HERO00003-16e8ac51adc94dd58620c8fa2bdf5f70.jpg',
    [new Ingredient('Noodles', 16), new Ingredient('Eggs', 3), new Ingredient('Shrimp', 10)]
  )
];
