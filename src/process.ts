


export function processText(input: string) {

    // Dev - make this better
    var new_word = input.toLowerCase();
    // remove turkish characters
    var new_word = new_word.replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u');
    // Remove unwanted
    var new_word = new_word.replace(/,/g, ' ');
    var new_word = new_word.replace(/:/g, ' ');
    var new_word = new_word.replace(/;/g, ' ');
    
    // remove first and last space
    var new_word = new_word.trim();
    // replace multiple white space with one    
    var new_word = new_word.replace(/\s{2,}/g, ' ');    
    var new_word = new_word.replace(/ /g, '.');

    // var final_word = "<?=lang('${new_word}')?>";
    var group = 'general.';
    var new_word = group + new_word;

    // Output
    var output = {
        'lang_key': new_word,
        'final_word': "<?=lang('" + new_word + "')?>",
        'final_word_in_php': "lang('" + new_word + "')",
        'lang_output': '$lang["' + new_word + '"] = "' + input + '";'
    }

    return output;
}