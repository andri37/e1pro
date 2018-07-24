/**
 * Created by nokamojd on 16/08/2016.
 */

var request = require('request');
var methodOverride = require('method-override');


var apiOptions = {
    server : "http://localhost:5000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "http://thawing-fjord-87586.herokuapp.com";
}
// error handling function
var _showError = function (req, res, status) {
    var errTitle, content;
    if (status === 404) {
        errTitle = "404, page not found";
        content = "Oh dear. Looks like we can't find this page. Sorry.";
    } else {
        errTitle = status + ", something's gone wrong";
        content = "Something, somewhere, has gone just a little bit wrong.";
    }
    res.status(status);
    res.render('index', {
        errTitle : errTitle,
        content : content
    });
};


// fields page list renderer function
var renderRolesPage = function (req, res, responseBody) {
    if(!req.user) return res.redirect('/login');
    else if(req.user && req.user.user_role != '57b2e3f36a0c14cc080d2f64') return res.redirect('/denied');
    res.render('dashboard/roles-form', {
        title: 'Rôles | Emploi1pro',
        roles: responseBody
    });
};

// Get all languages controller
module.exports.allRoles = (function (req, res) {
    var requestOptions, path;
    path = '/api/roles';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
        //qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderRolesPage(req, res, body);
        }
    );

});


// Create a Language Controller method
module.exports.addRole = (function (req, res) {
    var requestOptions, path, postData;
    path='/api/roles';
    postData = {
        role_label: req.body.role
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"POST",
        json: postData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 201) {
                res.redirect('users/roles');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Update a field controller method
module.exports.updateRole = (function (req, res) {
    var requestOptions, path, putData;

    path='/api/roles/'+ req.params.id_role;
    putData = {
        role_label: req.body.role
    };
    requestOptions = {
        url: apiOptions.server + path,
        method:"PUT",
        json: putData
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 200) {
                res.redirect('/dashboard/users/roles');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});


// Delete a field controller method
module.exports.deleteRole = (function (req, res) {
    var requestOptions, path;
    path='/api/roles/'+ req.params.id_role;
    requestOptions = {
        url: apiOptions.server + path,
        method:"DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if(response.statusCode === 204) {
                res.redirect('/dashboard/users/roles');
            }
            else {
                _showError(req, res, response.statusCode);
            }
        }
    )
});