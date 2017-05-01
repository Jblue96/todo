$(document).ready(function(){

  var getTasks = function(){
    console.log('in getTasks');
    $.ajax({
      type: 'GET',
      url: '/retrieveTasks',
      success: function(response){
      console.log('return from get call:', response);
      $('#needCompleted').html='';//clear div
      var outputText = '';
      for (var i = 0; i < response.length; i++) {
        if(response[i].completed === true){
          outputText += '<p class="remove">' + response[i].task + ' ' + '<button class="deleteTaskButton" data="' + response[i].id + '">Delete</button>';
          $(this).hide();
        }//end if
        else {
          outputText += '<p class="donski">' + response[i].task + ' ' + '<button id="allDone" data="' + response[i].id + '">Complete</button>' + ' ' + '<button class="deleteTaskButton" data="' + response[i].id + '">Delete</button>';
        }///End else
      }//End for loop
    $('#needCompleted').html(outputText);
  }//end success function
});//End ajax
};//Wnd GET function

  var createTask = function(){
    console.log('in createTask');
    //Package Obj to db
    var sendObject={
      task: $('#willDo').val(),
      status: "false"
    };//end sendObject
    $.ajax({
      type: 'POST',
      url: '/addToList',
      data: sendObject,
      success: function(response){
        console.log('return from POST:', response);
        getTasks();
      },//end success function
      error: function(){
        console.log('error with POST ');
      }//end error function
    });//end of ajax
  };//End createTask


  $('#createTask').on('click', function(){
    createTask();
    $('#needCompleted').val('');
  });//end addItemButton on click
  $('#needCompleted').on('click', '#allDone',function(){
    $(this).parent().toggleClass('completed');
    $(this).hide();
    var status = $(this).attr('data');
    if (status === false){
      status = 'true';
    }//change status to completed
    var sendObject = {
      id: $(this).attr('data')
    };//end sendObject
    $.ajax({
      type:'PUT',
      url:'/completed',
      data: sendObject,
      success:function(response){
        console.log(response);
      }//end success
    });//end ajax
  });//end

  $('#needCompleted').on('click', '.deleteTaskButton',function(){
    if(confirm("Confirm Delete")=== true){
      $(this).parent().hide();
      var delObject = {
        id: $(this).attr('data')
      };//end delObject
      console.log(delObject);
      $.ajax({
        type:'DELETE',
        url:'/delete',
        data: delObject,
        success:function(response){
          console.log(response, 'removed item');
        }
      });
    }//end if
  });//end deleteTaskButton
  getTasks();

});//end dready
