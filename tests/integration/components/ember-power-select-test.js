import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { RSVP } = Ember;

const numbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty'
];

const names = [
  "María",
  "Søren Larsen",
  "João",
  "Miguel",
  "Marta",
  "Lisa"
];

const countries = [
  { name: 'United States',  code: 'US', population: 321853000 },
  { name: 'Spain',          code: 'ES', population: 46439864 },
  { name: 'Portugal',       code: 'PT', population: 10374822 },
  { name: 'Russia',         code: 'RU', population: 146588880 },
  { name: 'Latvia',         code: 'LV', population: 1978300 },
  { name: 'Brazil',         code: 'BR', population: 204921000 },
  { name: 'United Kingdom', code: 'GB', population: 64596752 },
];

const groupedNumbers = [
  { groupName: "Smalls", options: ["one", "two", "three"] },
  { groupName: "Mediums", options: ["four", "five", "six"] },
  { groupName: "Bigs", options: [
      { groupName: "Fairly big", options: ["seven", "eight", "nine"] },
      { groupName: "Really big", options: [ "ten", "eleven", "twelve" ] },
      "thirteen"
    ]
  },
  "one hundred",
  "one thousand"
];

function typeInSearch(text) {
  $('.ember-power-select-search input').val(text);
  $('.ember-power-select-search input').trigger('input');
}

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (General behavior)', {
  integration: true
});

test('Clicking in the trigger of a closed select opens the dropdown', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
});

test('Clicking in the trigger of an opened select closes the dropdown', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');
});

test('Search functionality is enabled by default', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-search').length, 1, 'The search box is rendered');
});

test('The search functionality can be disabled by passing `searchEnabled=false`', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) searchEnabled=false as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-search').length, 0, 'The search box NOT rendered');
});

test('The search box gain focus automatically when opened', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok($('.ember-power-select-search input').is(':focus'), 'The search box is focused after opening select');
});

test('Each option of the select is the result of yielding an item', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, numbers.length, 'There is as many options in the markup as in the supplied array');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'one');
  assert.equal($('.ember-power-select-option:eq(9)').text().trim(), 'ten');
  assert.equal($('.ember-power-select-option:eq(13)').text().trim(), 'fourteen');
});

test('If the passed options is a promise, while its not resolved the component shows a Loading message', function(assert) {
  let done = assert.async();
  assert.expect(3);

  this.numbersPromise = new RSVP.Promise(function(resolve) {
    Ember.run.later(function() { console.debug('resolved!'); resolve(numbers); }, 100);
  });

  this.render(hbs`
    {{#ember-power-select options=(readonly numbersPromise) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());

  assert.equal($('.ember-power-select-option').text().trim(), 'Loading options...', 'The loading message appears while the promise is pending');
  setTimeout(function() {
    assert.ok(!/Loading options/.test($('.ember-power-select-option').text()), 'The loading message is gone');
    assert.equal($('.ember-power-select-option').length, 20, 'The results appear when the promise is resolved');
    done();
  }, 150);
});

test('If a placeholder is provided, it shows while no element is selected', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) placeholder="abracadabra" as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-trigger .ember-power-select-placeholder').text().trim(), 'abracadabra', 'The placeholder is rendered when there is no element');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option:eq(3)').click());
  assert.equal($('.ember-power-select-trigger .ember-power-select-placeholder').length, 0, 'The placeholder is gone');
  assert.equal($('.ember-power-select-trigger').text().trim(), 'four', 'The selected item replaced it');
});

/**
2 - Passing an empty array
  a) [DONE] A "No options" message appears by default.
  b) [DONE] That message can be customized passing an option.
  c) [DONE] That message can be customized passing an inverse block to the component.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Empty options)', {
  integration: true
});

test('The dropdowns shows the default "no options" message', function(assert) {
  this.options = [];
  this.render(hbs`
    {{#ember-power-select options=(readonly options) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, 1);
  assert.equal($('.ember-power-select-option').text().trim(), 'No results found');
});

test('The default "no options" message can be customized passing `noMatchesMessage="other message"`', function(assert) {
  this.options = [];
  this.render(hbs`
    {{#ember-power-select options=(readonly options) noMatchesMessage="Nope" as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, 1);
  assert.equal($('.ember-power-select-option').text().trim(), 'Nope');
});

test('The content of the dropdown when there is no options can be completely customized using the inverse block', function(assert) {
  this.options = [];
  this.render(hbs`
    {{#ember-power-select options=(readonly options) noMatchesMessage="Nope" as |option|}}
      {{option}}
    {{else}}
      <span class="empty-option-foo">Foo bar</span>
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').length, 0, 'No list elements, just the given alternate block');
  assert.equal($('.empty-option-foo').length, 1);
});

/**
3 - Passing an array of strings
  a) [DONE] When NO selected option is provided the first element of the list is highlighted.
  b) [DONE] When a select option is provided that option appears in the component's trigger.
  c) [DONE] When a select option is provided that option is highlighed when opened.
  d) [DONE] When a select option is provided that element of the list is also marked with the `.selected` class.
  e) [DONE] The default search matches filters correctly ignoring diacritics (accents/capitals/ect...)
  f) [DONE] You can pass a custom matcher for customize the search.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Options are strings)', {
  integration: true
});

test('When no `selected` is provided, the first item in the dropdown is highlighted', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-option.highlighted').length, 1, 'One element is highlighted');
  assert.ok($('.ember-power-select-option:eq(0)').hasClass('highlighted'), 'The first one to be precise');
});

test('When `selected` option is provided, it appears in the trigger yielded with the same block as the options', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select selected="three" options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal(this.$().text().trim(), 'three', 'The selected option show in the trigger');

  this.render(hbs`
    {{#ember-power-select selected="three" options=(readonly numbers) as |option|}}
      Selected: {{option}}
    {{/ember-power-select}}
  `);
  assert.equal(this.$().text().trim(), 'Selected: three', 'The selected option uses the same yielded block as the options');
});

test('When `selected` option is provided, it is highlighted when the dropdown opens', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select selected="three" options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  const $highlightedOption = $('.ember-power-select-option.highlighted');
  assert.equal($highlightedOption.length, 1, 'One element is highlighted');
  assert.equal($highlightedOption.text().trim(), 'three', 'The third option is highlighted');
});

test('When `selected` option is provided, that option is marked as `.selected`', function(assert) {
  assert.expect(1);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select selected="three" options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  const $selectedOption = $('.ember-power-select-option:contains("three")');
  assert.ok($selectedOption.hasClass('selected'), 'The third option is marked as selected');
});

test('The default search strategy matches disregarding diacritics differences and capitalization', function(assert) {
  assert.expect(8);

  this.names = names;
  this.render(hbs`
    {{#ember-power-select options=(readonly names) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('mar'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'María');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta');
  Ember.run(() => typeInSearch('mari'));
  assert.equal($('.ember-power-select-option').length, 1, 'Only 1 results match the search');
  assert.equal($('.ember-power-select-option').text().trim(), 'María');
  Ember.run(() => typeInSearch('o'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Søren Larsen');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'João');
});

test('You can pass a custom marcher with `matcher=myFn` to customize the search strategi', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.endsWithMatcher = function(value, text) {
    return text === '' || value.slice(text.length * -1) === text;
  };

  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) matcher=endsWithMatcher as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('on'));
  assert.equal($('.ember-power-select-option').text().trim(), "No results found", 'No number ends in "on"');
  Ember.run(() => typeInSearch('teen'));
  assert.equal($('.ember-power-select-option').length, 7, 'There is 7 number that end in "teen"');
});

/**
4 - Passing an array of objects
  a) [DONE] When NO selected option is provided the first element of the list is highlighted.
  b) [DONE] When a select option is provided that option appears in the component's trigger.
  c) [DONE] When a select option is provided that option is highlighed when opened.
  d) [DONE] When a select option is provided that element of the list is also marked with the `.selected` class.
  e) [DONE] The search works when you provide a searchFileld, ignoring diacritics and capitalization
  f) [DONE] You can pass a custom matcher for customize the search.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Options are objects)', {
  integration: true
});

test('When no `selected` is provided, the first item in the dropdown is highlighted', function(assert) {
  assert.expect(3);

  this.countries = countries;
  this.render(hbs`
    {{#ember-power-select options=(readonly countries) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'Dropdown is rendered');
  assert.equal($('.ember-power-select-option.highlighted').length, 1, 'One element is highlighted');
  assert.ok($('.ember-power-select-option:eq(0)').hasClass('highlighted'), 'The first one to be precise');
});

test('When a option is provided that options is rendered in the trigger using the same block as the options', function(assert) {
  assert.expect(1);

  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#ember-power-select options=(readonly countries) selected=(readonly country) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-trigger').text().trim(), 'ES: Spain', 'The selected country is rendered in the trigger');
});

test('When `selected` option is provided, it is highlighted when the dropdown opens', function(assert) {
  assert.expect(2);

  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#ember-power-select options=(readonly countries) selected=(readonly country) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  const $highlightedOption = $('.ember-power-select-option.highlighted');
  assert.equal($highlightedOption.length, 1, 'One element is highlighted');
  assert.equal($highlightedOption.text().trim(), 'ES: Spain', 'The second option is highlighted');
});

test('When `selected` option is provided, that option is marked as `.selected`', function(assert) {
  assert.expect(1);

  this.countries = countries;
  this.country = countries[1]; // Spain
  this.render(hbs`
    {{#ember-power-select options=(readonly countries) selected=(readonly country) as |option|}}
      {{option.code}}: {{option.name}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  const $selectedOption = $('.ember-power-select-option:contains("ES: Spain")');
  assert.ok($selectedOption.hasClass('selected'), 'The second option is marked as selected');
});

test('The default search strategy matches disregarding diacritics differences and capitalization', function(assert) {
  assert.expect(8);

  this.people = [
    { name: 'María',  surname: 'Murray' },
    { name: 'Søren',  surname: 'Williams' },
    { name: 'João',   surname: 'Jin' },
    { name: 'Miguel', surname: 'Camba' },
    { name: 'Marta',  surname: 'Stinson' },
    { name: 'Lisa',   surname: 'Simpson' },
  ];

  this.render(hbs`
    {{#ember-power-select options=(readonly people) searchField="name" as |person|}}
      {{person.name}} {{person.surname}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('mar'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'María Murray');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta Stinson');
  Ember.run(() => typeInSearch('mari'));
  assert.equal($('.ember-power-select-option').length, 1, 'Only 1 results match the search');
  assert.equal($('.ember-power-select-option').text().trim(), 'María Murray');
  Ember.run(() => typeInSearch('o'));
  assert.equal($('.ember-power-select-option').length, 2, 'Only 2 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Søren Williams');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'João Jin');
});

test('You can pass a custom marcher with `matcher=myFn` to customize the search strategi', function(assert) {
  assert.expect(4);

  this.people = [
    { name: 'María',  surname: 'Murray' },
    { name: 'Søren',  surname: 'Williams' },
    { name: 'João',   surname: 'Jin' },
    { name: 'Miguel', surname: 'Camba' },
    { name: 'Marta',  surname: 'Stinson' },
    { name: 'Lisa',   surname: 'Simpson' },
  ];

  this.nameOrSurnameNoDiacriticsCaseSensitive = function(value, text) {
    return text === '' || value.name.indexOf(text) > -1 || value.surname.indexOf(text) > -1;
  };

  this.render(hbs`
    {{#ember-power-select options=(readonly people) matcher=nameOrSurnameNoDiacriticsCaseSensitive as |person|}}
      {{person.name}} {{person.surname}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('s'));
  assert.equal($('.ember-power-select-option').length, 3, 'Only 3 results match the search');
  assert.equal($('.ember-power-select-option:eq(0)').text().trim(), 'Søren Williams');
  assert.equal($('.ember-power-select-option:eq(1)').text().trim(), 'Marta Stinson');
  assert.equal($('.ember-power-select-option:eq(2)').text().trim(), 'Lisa Simpson');
});

/**
5 - Custom search action
  a) [DONE] When you pass a custom search action instead of options, opening the select show a "Type to search" message in a <li>
  b) [DONE] The "type to search" message can be customized passing the custom message.
  c) [DONE] The search function can return an array and those options get rendered.
  d) [DONE] The search function can return an a promise that resolves to an array too.
  e) [DONE] While the async search is being performed the "Type to search" dissapears the "Loading..." message appears.
  f) [DONE] When the search resolves to an empty array then the "No results found"
  g) [DONE] When the search resolves to an empty array then the custom noMatchesMessafe is displayed.
  h) [DONE] When the search resolves to an empty array then the given altertate block is rendered.
  i) [DONE] When one search is fired before the previous one resolved, the "Loading" continues until the 2nd is resolved.
  j) [DONE] Once the promise is resolved, the first element is highlighted.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Custom search function)', {
  integration: true
});

test('When you pass a custom search action instead of options, opening the select show a "Type to search" message in a list element', function(assert) {
  assert.expect(1);

  this.searchFn = function() {};

  this.render(hbs`
    {{#ember-power-select search=searchFn as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').text(), 'Type to search', 'The dropdown shows the "type to seach" message');
});

test('The "type to search" message can be customized passing `searchMessage=something`', function(assert) {
  assert.expect(1);

  this.searchFn = function() {};
  this.render(hbs`
    {{#ember-power-select search=searchFn searchMessage="Type the name of the thing" as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option').text(), 'Type the name of the thing');
});

test('The search function can return an array and those options get rendered', function(assert) {
  assert.expect(1);

  this.searchFn = function(term) {
    return numbers.filter(str => str.indexOf(term) > -1);
  };

  this.render(hbs`
    {{#ember-power-select search=(readonly searchFn) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));
  assert.equal($('.ember-power-select-option').length, 7);
});

test('The search function can return a promise that resolves to an array and those options get rendered', function(assert) {
  let done = assert.async();
  assert.expect(1);

  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#ember-power-select search=(readonly searchFn) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));

  setTimeout(function() {
    assert.equal($('.ember-power-select-option').length, 7);
    done();
  }, 150);
});

test('While the async search is being performed the "Type to search" dissapears the "Loading..." message appears', function(assert) {
  let done = assert.async();
  assert.expect(3);

  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#ember-power-select search=(readonly searchFn) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok(/Type to search/.test($('.ember-power-select-dropdown').text()), 'The type to search message is displayed');
  Ember.run(() => typeInSearch("teen"));
  assert.ok(!/Type to search/.test($('.ember-power-select-dropdown').text()), 'The type to search message dissapeared');
  assert.ok(/Loading options\.\.\./.test($('.ember-power-select-dropdown').text()), '"Loading options..." message appears');
  setTimeout(done, 150);
});

test('When the search resolves to an empty array then the "No results found" message or block appears.', function(assert) {
  var done = assert.async();
  assert.expect(1);

  this.searchFn = function() {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() { resolve([]); }, 10);
    });
  };

  this.render(hbs`
    {{#ember-power-select search=(readonly searchFn) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));
  setTimeout(() => {
    assert.ok(/No results found/.test($('.ember-power-select-option').text()), 'The default "No results" message renders');
    done();
  }, 20);
});

test('When the search resolves to an empty array then the custom "No results" message appears', function(assert) {
  var done = assert.async();
  assert.expect(1);

  this.searchFn = function() {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() { resolve([]); }, 10);
    });
  };

  this.render(hbs`
    {{#ember-power-select search=(readonly searchFn) noMatchesMessage="Meec. Try again" as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));
  setTimeout(() => {
    assert.ok(/Meec\. Try again/.test($('.ember-power-select-option').text()), 'The customized "No results" message renders');
    done();
  }, 20);
});

test('When the search resolves to an empty array then the custom alternate block renders', function(assert) {
  var done = assert.async();
  assert.expect(1);

  this.searchFn = function() {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() { resolve([]); }, 10);
    });
  };

  this.render(hbs`
    {{#ember-power-select search=(readonly searchFn) as |number|}}
      {{number}}
    {{else}}
      <span class="foo-bar">Baz</span>
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));
  setTimeout(() => {
    assert.equal($('.ember-power-select-dropdown .foo-bar').length, 1, 'The alternate block message gets rendered');
    done();
  }, 20);
});

test('When one search is fired before the previous one resolved, the "Loading" continues until the 2nd is resolved', function(assert) {
  var done = assert.async();
  assert.expect(2);

  this.searchFn = function() {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() { resolve(numbers); }, 100);
    });
  };

  this.render(hbs`
    {{#ember-power-select search=(readonly searchFn) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));

  setTimeout(function() {
    Ember.run(() => typeInSearch("teen"));
  }, 50);

  setTimeout(function() {
    assert.ok(/Loading options/.test($('.ember-power-select-option').text()));
    assert.equal($('.ember-power-select-option').length, 1, 'No results are shown');
  }, 120);

  setTimeout(done, 180);
});

test('When the search resolves, the first element is highlighted like with regular filtering', function(assert) {
  var done = assert.async();
  assert.expect(1);

  this.searchFn = function(term) {
    return new RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve(numbers.filter(str => str.indexOf(term) > -1));
      }, 100);
    });
  };

  this.render(hbs`
    {{#ember-power-select search=(readonly searchFn) as |number|}}
      {{number}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch("teen"));

  setTimeout(function() {
    assert.ok($('.ember-power-select-option:eq(0)').hasClass('highlighted'), 'The first result is highlighted');
    done();
  }, 110);
});

/**
6 - Groups
  a) [DONE] Options that have a `groupName` and `options` are considered groups and are rendered as such.
  b) [DONE] Filtering works with groups (a group title is visible as long as one of it's elements matches)
     the search criteria) with no depth limit.
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Groups)', {
  integration: true
});

test('Options that have a `groupName` and `options` are considered groups and are rendered as such', function(assert) {
  assert.expect(10);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly groupedNumbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'Dropdown is not rendered');

  Ember.run(() => this.$('.ember-power-select-trigger').click());

  let $rootLevelGroups = $('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-group');
  let $rootLevelOptions = $('.ember-power-select-dropdown > .ember-power-select-options > .ember-power-select-option');
  assert.equal($rootLevelGroups.length, 3, 'There is 3 groups in the root level');
  assert.equal($rootLevelOptions.length, 2, 'There is 2 options in the root level');
  assert.equal($($rootLevelGroups[0]).find('.ember-power-select-group-name').text().trim(), 'Smalls');
  assert.equal($($rootLevelGroups[1]).find('.ember-power-select-group-name').text().trim(), 'Mediums');
  assert.equal($($rootLevelGroups[2]).find('> .ember-power-select-group-name').text().trim(), 'Bigs');
  assert.equal($($rootLevelOptions[0]).text().trim(), 'one hundred');
  assert.equal($($rootLevelOptions[1]).text().trim(), 'one thousand');

  let $bigs = $($rootLevelGroups[2]).find('> .ember-power-select-options.nested');
  assert.equal($bigs.find('> .ember-power-select-group').length, 2, 'There is 2 sub-groups in the "bigs" group');
  assert.equal($bigs.find('> .ember-power-select-option').length, 1, 'There is 1 option in the "bigs" group');
});

test('When filtering, a group title is visible as long as one of it\'s elements is', function(assert) {
  assert.expect(3);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly groupedNumbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => typeInSearch('ve'));
  let groupNames = $('.ember-power-select-group-name').toArray().map(e => $(e).text().trim());
  let optionValues = $('.ember-power-select-option').toArray().map(e => $(e).text().trim());
  assert.deepEqual(groupNames, ["Mediums", "Bigs", "Fairly big", "Really big"], 'Only the groups with matching options are shown');
  assert.deepEqual(optionValues, ["five", "seven", "eleven", "twelve"], 'Only the matching options are shown');
  Ember.run(() => typeInSearch('lve'));
  groupNames = $('.ember-power-select-group-name').toArray().map(e => $(e).text().trim());
  assert.deepEqual(groupNames, ["Bigs", "Really big"], 'With no depth level');
});

/**
7 - Mouse control
  a) [DONE] Mouseovering a list item highlights it.
  b) [DONE] Clicking an item selects it, closes the dropdown and focuses the trigger.
  c) [DONE] Clicking the trigger while the select is opened closes it and and focuses the trigger.
  d) [DONE] Clicking the clear button removes the selection but doesn't opens the dropdon.
  e) [DONE] Clicking anywhere outside the select while opened closes the component AND DOESN'T FOCUSES THE TRIGGER (FAILING NOW)
  f) [DONE] Clicking on the title of a group doesn't performs any action nor closes the dropdown.
*/
moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Mouse control)', {
  integration: true
});

test('Mouseovering a list item highlights it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.ok($('.ember-power-select-option:eq(0)').hasClass('highlighted'), 'The first element is highlighted');
  Ember.run(() => $('.ember-power-select-option:eq(3)').trigger('mouseover'));
  assert.ok($('.ember-power-select-option:eq(3)').hasClass('highlighted'), 'The 4th element is highlighted');
  assert.equal($('.ember-power-select-option:eq(3)').text().trim(), 'four');
});

test('Clicking an item selects it, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => $('.ember-power-select-option:eq(3)').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select was closed');
  assert.ok($('.ember-power-select-trigger').is(':focus'), 'The trigger is focused');
});

test('Clicking the trigger while the select is opened closes it and and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').is(':focus'), 'The trigger is focused');
});

test('Clicking the clear button removes the selection', function(assert) {
  assert.expect(5);

  this.numbers = numbers;
  this.onChange = function(selected) {
    assert.equal(selected, null, 'The onchange action was called with the new selection (null)');
  };
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) selected="three" allowClear=true onchange=(readonly onChange) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok(/three/.test($('.ember-power-select-trigger').text().trim()), 'A element is selected');
  Ember.run(() => $('.ember-power-select-clear-btn').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
  assert.ok(!/three/.test($('.ember-power-select-trigger').text().trim()), 'That element is not selected now');
});

test('Clicking anywhere outside the select while opened closes the component and doesn\'t focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    <div id="other-thing">Foo</div>
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  Ember.run(() => this.$('#other-thing').click());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok(!$('.ember-power-select-trigger').is(':focus'), 'The select is not focused');
});

test('Clicking on the title of a group doesn\'t performs any action nor closes the dropdown', function(assert) {
  assert.expect(1);

  this.groupedNumbers = groupedNumbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly groupedNumbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  Ember.run(() => this.$('.ember-power-select-group-name:eq(1)').click());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is still opened');
});

/**
8 - Keyboard control
  a) [DONE] Pressing keydown highlights the next option.
  b) [DONE] Pressing keyup highlights the previous option.
  c) [FAILING] When you the last option is highlighted, pressing keydown doesn't change the highlighted.
  d) [DONE] When you the first option is highlighted, pressing keyup doesn't change the highlighted.
  e) [DONE] Pressing ENTER selects the highlighted element, closes the dropdown and focuses the trigger.
  f) [DONE] Pressing TAB closes the select WITHOUT selecting the highlighed element and focuses the trigger.

  ... add cases for navigation between
*/

moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Keyboard control)', {
  integration: true
});

test('Pressing keydown highlights the next option', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'one');
  let downArrow = $.Event("keydown", { keyCode: 40 });
  Ember.run(() => $('.ember-power-select-search input').trigger(downArrow));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'two', 'The next options is highlighted now');
});

test('Pressing keyup highlights the previous option', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) selected="three" as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'three');
  let upArrow = $.Event("keydown", { keyCode: 38 });
  Ember.run(() => $('.ember-power-select-search input').trigger(upArrow));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'two', 'The previous options is highlighted now');
});

test('When you the last option is highlighted, pressing keydown doesn\'t change the highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.lastNumber = numbers[numbers.length - 1];
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) selected=(readonly lastNumber) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'twenty');
  let downArrow = $.Event("keydown", { keyCode: 40 });
  Ember.run(() => $('.ember-power-select-search input').trigger(downArrow));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'twenty', 'The last option is still the highlighted one');
});

test('When you the first option is highlighted, pressing keyup doesn\'t change the highlighted', function(assert) {
  assert.expect(2);

  this.numbers = numbers;
  this.firstNumber = numbers[0];
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) selected=(readonly firstNumber) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'one');
  let upArrow = $.Event("keydown", { keyCode: 38 });
  Ember.run(() => $('.ember-power-select-search input').trigger(upArrow));
  assert.equal($('.ember-power-select-option.highlighted').text().trim(), 'one', 'The first option is still the highlighted one');
});

test('Pressing ENTER selects the highlighted element, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.changed = function(val) {
    assert.equal(val, 'two', 'The onchange action is triggered with the selected value');
  };

  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) onchange=(readonly changed) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  let downArrow = $.Event("keydown", { keyCode: 40 });
  let enter = $.Event("keydown", { keyCode: 13 });
  Ember.run(() => $('.ember-power-select-search input').trigger(downArrow));
  Ember.run(() => $('.ember-power-select-search input').trigger(enter));
  assert.equal($('.ember-power-select-trigger').text().trim(), 'two', 'The highlighted element was selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').is(':focus'), 'The trigges is focused');
});

test('Pressing TAB closes the select WITHOUT selecting the highlighed element and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#ember-power-select options=(readonly numbers) as |option|}}
      {{option}}
    {{/ember-power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').click());
  let downArrow = $.Event("keydown", { keyCode: 40 });
  let tab = $.Event("keydown", { keyCode: 9 });
  Ember.run(() => $('.ember-power-select-search input').trigger(downArrow));
  Ember.run(() => $('.ember-power-select-search input').trigger(tab));
  assert.equal($('.ember-power-select-trigger').text().trim(), '', 'The highlighted element wasn\'t selected');
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The dropdown is closed');
  assert.ok($('.ember-power-select-trigger').is(':focus'), 'The trigges is focused');
});

