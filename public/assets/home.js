$(document).ready(function () {
  $(document).on('click','.saver',function (event) {
    event.preventDefault();
    const target = $(this);

    const id = $(this).attr('data-id');
    $.ajax({
      method: 'POST',
      url: '/save/' +id
    })
    .then(function () {
      target.hide('fast');
    })
    .catch(function (err) {
      if (err) throw err;
    })
  })

  $(document).on('click','.forgetter',function (event) {
    event.preventDefault();
    const target = $(this);
    const id = $(this).attr('data-id');
    $.ajax({
      method: 'POST',
      url: '/forget/' +id
    })
    .then(function () {

      target.hide('fast');
    })
    .catch(function (err) {
      if (err) throw err;
    })
  })
})
