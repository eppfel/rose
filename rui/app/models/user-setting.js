import DS from 'ember-data';

export default DS.Model.extend({
  commentReminderIsEnabled: DS.attr('boolean'),
  trackingEnabled: DS.attr('boolean', { defaultValue: true }),
  developerModeIsEnabled: DS.attr('boolean'),
  currentLanguage: DS.attr('string', { defaultValue: 'en' }),
  firstRun: DS.attr('boolean', { defaultValue: 'true' })
});
