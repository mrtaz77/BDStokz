concat("STANDARD_HASH('",base64(this),"','SHA512')")
concat("TO_DATE('",this,"','YYYY-MM-DD')")

trim_before_at = ->(string) { "@" + string.split('@').last }

clean_string = ->(string) {
  words = string.split
  if words.length >= 2
    first_word = words[0].downcase.gsub(/[^a-z0-9]/, '')
    second_word = words[1].downcase.gsub(/[^a-z0-9]/, '')
    "#{first_word}#{second_word}"
  else
    string.downcase.gsub(/[^a-z0-9]/, '')
  end
}

concat(clean_string.call(field('NAME')),trim_before_at.call(this))

# Manager id gen using row number 
if (this > 0) and (this < 11)
  120
elsif this > 1
  random(1, 9) * 10 + 100
end

