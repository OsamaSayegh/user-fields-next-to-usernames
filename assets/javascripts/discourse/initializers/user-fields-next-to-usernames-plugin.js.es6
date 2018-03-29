import { withPluginApi } from 'discourse/lib/plugin-api';
import { h } from 'virtual-dom';

function initializeWithApi(api) {
  api.includePostAttributes("display_user_fields");
  api.reopenWidget("poster-name", {
    html(attrs) {
      const s = this._super(...arguments);
      const userFields = attrs.display_user_fields;
      const siteUserFields = Discourse.Site.currentProp("user_fields");
    
      if (userFields.length === 0 || siteUserFields.length === 0) return s;
    
      const results = [];
      siteUserFields.forEach(field => {
        const match = userFields.find(_field => _field[field.id] !== undefined);
        if (match === undefined) return s;
        results.push(I18n.t("user_fields_next_to_usernames.format", { field_name: field.name, field_value: match[field.id] }));
      })

      s.push(h("span.display-user-fields", results.join(I18n.t("user_fields_next_to_usernames.join"))));
      return s;
    }
  })
}

export default {
  name: 'user-fields-next-to-usernames-plugin',
  initialize() {
    withPluginApi('0.8.13', initializeWithApi);
  }
};
