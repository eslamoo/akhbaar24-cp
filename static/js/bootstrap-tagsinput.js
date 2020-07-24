
(function ($) {
  const delimiter = [];
  const inputSettings = [];
  const callbacks = [];

  jQuery.prototype.addTag = function (value, options) {
    options = jQuery.extend({
      focus: false,
      callback: true
    }, options);

    this.each(function () {
      const id = $(this).attr('id');

      let tagslist = $(this).val().split(_getDelimiter(delimiter[id]));
      if (tagslist[0] === '') { tagslist = []; }

      value = jQuery.trim(value);

      if ((inputSettings[id].unique && $(this).tagExist(value)) || !_validateTag(value, inputSettings[id], tagslist, delimiter[id])) {
        $('#' + id + '_tag').addClass('error');
        return false;
      }

      $('<span>', { class: 'tag' }).append(
        $('<span>', { class: 'tag-text' }).text(value),
        $('<button>', { class: 'tag-remove' }).click(function () {
          return $('#' + id).removeTag(encodeURI(value));
        })
      ).insertBefore('#' + id + '_addTag');

      tagslist.push(value);

      $('#' + id + '_tag').val('');
      if (options.focus) {
        $('#' + id + '_tag').focus();
      } else {
        $('#' + id + '_tag').blur();
      }

      jQuery.prototype.tagsInput.updateTagsField(this, tagslist);

      if (options.callback && callbacks[id] && callbacks[id].onAddTag) {
        var f = callbacks[id].onAddTag;
        f.call(this, this, value);
      }

      if (callbacks[id] && callbacks[id].onChange) {
        const i = tagslist.length;
        var f = callbacks[id].onChange;
        f.call(this, this, value);
      }
    });

    return false;
  };

  jQuery.prototype.removeTag = function (value) {
    value = decodeURI(value);

    this.each(function () {
      const id = $(this).attr('id');

      const old = $(this).val().split(_getDelimiter(delimiter[id]));

      $('#' + id + '_tagsinput .tag').remove();

      let str = '';
      for (i = 0; i < old.length; ++i) {
        if (old[i] != value) {
          str = str + _getDelimiter(delimiter[id]) + old[i];
        }
      }

      jQuery.prototype.tagsInput.importTags(this, str);

      if (callbacks[id] && callbacks[id].onRemoveTag) {
        const f = callbacks[id].onRemoveTag;
        f.call(this, this, value);
      }
    });

    return false;
  };

  jQuery.prototype.tagExist = function (val) {
    const id = $(this).attr('id');
    const tagslist = $(this).val().split(_getDelimiter(delimiter[id]));
    return (jQuery.inArray(val, tagslist) >= 0);
  };

  jQuery.prototype.importTags = function (str) {
    const id = $(this).attr('id');
    $('#' + id + '_tagsinput .tag').remove();
    jQuery.prototype.tagsInput.importTags(this, str);
  };

  jQuery.prototype.tagsInput = function (options) {
    const settings = jQuery.extend({
      interactive: true,
      // placeholder: 'أضف وسم',
      minChars: 0,
      maxChars: null,
      limit: null,
      validationPattern: null,
      width: 'auto',
      height: 'auto',
      autocomplete: null,
      hide: true,
      delimiter: ',',
      unique: true,
      removeWithBackspace: true
    }, options);

    let uniqueIdCounter = 0;

    this.each(function () {
      if (typeof $(this).data('tagsinput-init') !== 'undefined') { return; }

      $(this).data('tagsinput-init', true);

      if (settings.hide) { $(this).hide(); }

      let id = $(this).attr('id');
      if (!id || _getDelimiter(delimiter[$(this).attr('id')])) {
        id = $(this).attr('id', 'tags' + new Date().getTime() + (++uniqueIdCounter)).attr('id');
      }

      const data = jQuery.extend({
        pid: id,
        real_input: '#' + id,
        holder: '#' + id + '_tagsinput',
        input_wrapper: '#' + id + '_addTag',
        fake_input: '#' + id + '_tag'
      }, settings);

      delimiter[id] = data.delimiter;
      inputSettings[id] = {
        minChars: settings.minChars,
        maxChars: settings.maxChars,
        limit: settings.limit,
        validationPattern: settings.validationPattern,
        unique: settings.unique
      };

      if (settings.onAddTag || settings.onRemoveTag || settings.onChange) {
        callbacks[id] = [];
        callbacks[id].onAddTag = settings.onAddTag;
        callbacks[id].onRemoveTag = settings.onRemoveTag;
        callbacks[id].onChange = settings.onChange;
      }

      const markup = $('<div>', { id: id + '_tagsinput', class: 'tagsinput' }).append(
        $('<div>', { id: id + '_addTag' }).append(
          settings.interactive ? $('<input>', { id: id + '_tag', class: 'tag-input', value: '', placeholder: settings.placeholder }) : null
        )
      );

      $(markup).insertAfter(this);

      $(data.holder).css('width', settings.width);
      $(data.holder).css('min-height', settings.height);
      $(data.holder).css('height', settings.height);

      if ($(data.real_input).val() !== '') {
        jQuery.prototype.tagsInput.importTags($(data.real_input), $(data.real_input).val());
      }

      // Stop here if interactive option is not chosen
      if (!settings.interactive) { return; }

      $(data.fake_input).val('');
      $(data.fake_input).data('pasted', false);

      $(data.fake_input).on('focus', data, function (event) {
        $(data.holder).addClass('focus');

        if ($(this).val() === '') {
          $(this).removeClass('error');
        }
      });

      $(data.fake_input).on('blur', data, function (event) {
        $(data.holder).removeClass('focus');
      });

      if (settings.autocomplete !== null && jQuery.ui.autocomplete !== undefined) {
        $(data.fake_input).autocomplete(settings.autocomplete);
        $(data.fake_input).on('autocompleteselect', data, function (event, ui) {
          $(event.data.real_input).addTag(ui.item.value, {
            focus: true,
            unique: settings.unique
          });

          return false;
        });

        $(data.fake_input).on('keypress', data, function (event) {
          if (_checkDelimiter(event)) {
            $(this).autocomplete('close');
          }
        });
      } else {
        $(data.fake_input).on('blur', data, function (event) {
          $(event.data.real_input).addTag($(event.data.fake_input).val(), {
            focus: true,
            unique: settings.unique
          });

          return false;
        });
      }

      // If a user types a delimiter create a new tag
      $(data.fake_input).on('keypress', data, function (event) {
        if (_checkDelimiter(event)) {
          event.preventDefault();

          $(event.data.real_input).addTag($(event.data.fake_input).val(), {
            focus: true,
            unique: settings.unique
          });

          return false;
        }
      });

      $(data.fake_input).on('paste', function () {
        $(this).data('pasted', true);
      });

      // If a user pastes the text check if it shouldn't be splitted into tags
      $(data.fake_input).on('input', data, function (event) {
        if (!$(this).data('pasted')) { return; }

        $(this).data('pasted', false);

        let value = $(event.data.fake_input).val();

        value = value.replace(/\n/g, '');
        value = value.replace(/\s/g, '');

        const tags = _splitIntoTags(event.data.delimiter, value);

        if (tags.length > 1) {
          for (let i = 0; i < tags.length; ++i) {
            $(event.data.real_input).addTag(tags[i], {
              focus: true,
              unique: settings.unique
            });
          }

          return false;
        }
      });

      // Deletes last tag on backspace
      data.removeWithBackspace && $(data.fake_input).on('keydown', function (event) {
        if (event.keyCode == 8 && $(this).val() === '') {
					 event.preventDefault();
					 const lastTag = $(this).closest('.tagsinput').find('.tag:last > span').text();
					 const id = $(this).attr('id').replace(/_tag$/, '');
					 $('#' + id).removeTag(encodeURI(lastTag));
					 $(this).trigger('focus');
        }
      });

      // Removes the error class when user changes the value of the fake input
      $(data.fake_input).keydown(function (event) {
        // enter, alt, shift, esc, ctrl and arrows keys are ignored
        if (jQuery.inArray(event.keyCode, [13, 37, 38, 39, 40, 27, 16, 17, 18, 225]) === -1) {
          $(this).removeClass('error');
        }
      });
    });

    return this;
  };

  jQuery.prototype.tagsInput.updateTagsField = function (obj, tagslist) {
    const id = $(obj).attr('id');
    $(obj).val(tagslist.join(_getDelimiter(delimiter[id])));
  };

  jQuery.prototype.tagsInput.importTags = function (obj, val) {
    $(obj).val('');

    const id = $(obj).attr('id');
    const tags = _splitIntoTags(delimiter[id], val);

    for (i = 0; i < tags.length; ++i) {
      $(obj).addTag(tags[i], {
        focus: false,
        callback: false
      });
    }

    if (callbacks[id] && callbacks[id].onChange) {
      const f = callbacks[id].onChange;
      f.call(obj, obj, tags);
    }
  };

  var _getDelimiter = function (delimiter) {
    if (typeof delimiter === 'undefined') {
      return delimiter;
    } else if (typeof delimiter === 'string') {
      return delimiter;
    } else {
      return delimiter[0];
    }
  };

  var _validateTag = function (value, inputSettings, tagslist, delimiter) {
    let result = true;

    if (value === '') { result = false; }
    if (value.length < inputSettings.minChars) { result = false; }
    if (inputSettings.maxChars !== null && value.length > inputSettings.maxChars) { result = false; }
    if (inputSettings.limit !== null && tagslist.length >= inputSettings.limit) { result = false; }
    if (inputSettings.validationPattern !== null && !inputSettings.validationPattern.test(value)) { result = false; }

    if (typeof delimiter === 'string') {
      if (value.includes(delimiter)) { result = false; }
    } else {
      $.each(delimiter, function (index, _delimiter) {
        if (value.includes(_delimiter)) { result = false; }
        return false;
      });
    }

    return result;
  };

  var _checkDelimiter = function (event) {
    let found = false;

    if (event.which === 13) {
      return true;
    }

    if (typeof event.data.delimiter === 'string') {
      if (event.which === event.data.delimiter.charCodeAt(0)) {
        found = true;
      }
    } else {
      $.each(event.data.delimiter, function (index, delimiter) {
        if (event.which === delimiter.charCodeAt(0)) {
          found = true;
        }
      });
    }

    return found;
	 };

	 var _splitIntoTags = function (delimiter, value) {
		 if (value === '') { return []; }

		 if (typeof delimiter === 'string') {
			 return value.split(delimiter);
		 } else {
			 const tmpDelimiter = '∞';
			 let text = value;

			 $.each(delimiter, function (index, _delimiter) {
				 text = text.split(_delimiter).join(tmpDelimiter);
			 });

			 return text.split(tmpDelimiter);
		 }

		 return [];
	 };
})(jQuery);
