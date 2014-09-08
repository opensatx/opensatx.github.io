
  var data_host = 'http://codeforamerica.org/api/organizations/Open-San-Antonio/projects'
  var people_table;

  // this is a template used for mustache.js. Each one represents a table row.
  var template = "\
    <tr>\
      <td>\
        <a href='{{html_url}}'>\
          <img class='img-thumbnail' src='{{avatar_url}}' alt='{{login}}' />\
          {{name}}\
        </a>\
      </td>\
      <td>{{location}}</td>\
      <td><a href='projects#/?search={{login}}'>{{repositories}}</a></td>\
      <td><a href='https://github.com/{{login}}?tab=activity'>{{contributions}}</a></td>\
    </tr>\
  ";

  $('#hack-night-people tbody').spin({top: '40px'}); //show a spinner while loading data

  $.when( $.getJSON( data_host ) ).then(function( data, textStatus, jqXHR ) {

    // Loop through each project and add the contributors to the list
    var projects = data.objects
    var people = []
    $.each(projects, function (i, project){

        // Lots of Chicago people worked on the website. Don't show them on the people page.
        if (project.name != "opensatx.github.io") {
            people = people.concat(project.github_details.contributors);
        }

    });

    // update project count at the top of the page
    $('#people-count').html(people.length);

    // loop through our json data
    $.each(people, function(i, json){
      if (json['name'] == null)
        json['name'] = json['login'];

      $("#hack-night-people tbody").append(Mustache.render(template, json));
    })

    // initialize datatables
    people_table = $('#hack-night-people').dataTable( {
        "aaSorting": [ [2,'desc'], [3, 'desc'] ],
        "aoColumns": [
            null,
            null,
            { "sType": "num-html" },
            { "sType": "num-html" }
        ],
        "bInfo": false,
        "bPaginate": false
    });

    // allows linking directly to searches
    if ($.address.parameter('search') != undefined)
      people_table.fnFilter( $.address.parameter('search') );

    // when someone types a search value, it updates the URL
    $('#hack-night-people_filter input').keyup(function(e){
      $.address.parameter('search', $('#hack-night-people_filter input').val());
    });
  });
