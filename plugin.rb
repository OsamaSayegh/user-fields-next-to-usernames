# name: user-fields-next-to-usernames
# about: A plugin to display user fields next to usernames
# version: 0.1
# authors: Osama Sayegh
# url: https://github.com/OsamaSayegh/user-fields-next-to-usernames

after_initialize do
  add_to_serializer(:post, :display_user_fields, false) do
    poster = object&.user
    return [] unless poster

    exempt_groups = SiteSetting.user_fields_next_to_usernames_exclude_groups.split("|")
    return [] if (poster.groups.pluck(:name).map(&:downcase) & exempt_groups.map(&:downcase)).present?

    display_fields = []
    SiteSetting.user_fields_next_to_usernames.split("|").each do |field_name|
      UserField.all.each do |field|
        display_fields << field if field.name.downcase.strip == field_name.downcase.strip
      end
    end

    display_fields.map do |field|
      hash = {}
      value = poster.custom_fields["user_field_#{field.id}"]
      next if value.blank?
      hash[field.id] = value
      hash
    end.compact
  end
end
