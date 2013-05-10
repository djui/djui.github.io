$(function() {
  var app = new Sammy.Application(function() {
    this.get("#/", function() {
      $("#main").text("");
    });
  
    this.get("#/test", function() {
      $("#main").text("Hello World");
    });
  });

  app.run();
});
