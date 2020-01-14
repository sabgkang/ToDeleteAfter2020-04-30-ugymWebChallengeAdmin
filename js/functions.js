function addChallenge() {
  console.log("addCoupon");

  if (!isLogin) {
    alert("必須登入後才能新增挑戰賽");
    return 0;
  }

  //挑戰賽最新編號++;
  $("#新增挑戰賽標題").text("新增挑戰賽 - T" + zeroFill(挑戰賽最新編號+1, 4));

  $("#挑戰賽表格").hide();
  $("#挑戰賽歷史表格").hide();
  $("#spacerBetweenTables").hide();

  $(".dataTables_filter").hide();
  $(".dataTables_info").hide();
  $('#挑戰賽表格_paginate').hide();
  $('#挑戰賽歷史表格_paginate').hide();

  $("#新增挑戰賽畫面").show();


  $("#挑戰賽標題").hide();
  $("#addChallengeBtn").hide();
  $("#refreshBtn").hide();
  //      $("#addChallengeBtn").attr("disabled", true);
  //      $("#refreshBtn").attr("disabled", true);
}

function 確認新增挑戰賽() {
  console.log("確認新增挑戰賽");

  if (!isLogin) {
    alert("必須登入後才能新增挑戰賽");
    return 0;
  }

  //var startDate = new Date($("#挑戰賽起始時間").val());
  //var nextDate = new Date();
  //console.log(startDate);
  //nextDate.setDate(startDate.getDate() - 7);
  //var repeatTimes=$("#重複次數").val();
  var repeatTimes=1;
  for (var i=0; i<repeatTimes; i++){
    挑戰賽最新編號++;
    //nextDate.setDate(nextDate.getDate() + 7);
    //nextDateStr = nextDate.toLocaleDateString();
    //nextDateStr = nextDateStr.replace(/\//g, "-");
    //console.log(挑戰賽最新編號, nextDateStr);
    
    //if(nextDate == "Invalid Date") {
    //  alert("有效期限日期錯誤");
    //  return 0;
    //}
    
    var couponNameTmp;
    couponNameTmp = (repeatTimes>1)? $("#新增挑戰賽內容").val()+" ("+(i+1)+")":$("#新增挑戰賽內容").val();
    
    var dataToAdd = [
              "T" + zeroFill(挑戰賽最新編號, 4),
              couponNameTmp,
              //$("#新增挑戰賽內容").val(),
              //nextDateStr,
              ($("#挑戰賽起始時間").val()+" ~ "+$("#挑戰賽結束時間").val()),
              $("#新增挑戰賽其他說明").val()
            ];

    console.log(dataToAdd);
    
    // 更新 local 挑戰賽資料 及 挑戰賽會員
    挑戰賽資料.push(dataToAdd);
    挑戰賽會員.push(["T" + zeroFill(挑戰賽最新編號, 4)]); //Fix bug:重複週期 新增挑戰賽 會只有增加最後一個挑戰賽 到 挑戰賽會員
  }
  


  // 挑戰賽寫入資料庫
  database.ref('users/林口運動中心/挑戰賽').set({
    現在挑戰賽: JSON.stringify(挑戰賽資料),
    過去挑戰賽: JSON.stringify(挑戰賽歷史資料),
  }, function (error) {
    if (error) {
      console.log("Write to database error, revert 挑戰賽資料 back");
      挑戰賽資料.pop();
    }
    console.log('Write to database successful');
  });


  database.ref('users/林口運動中心/挑戰賽管理').set({
    挑戰賽會員: JSON.stringify(挑戰賽會員),
  }, function (error) {
    if (error) {
      //console.log(error);
      return 0;
    }
    console.log('Write to database successful');
  });

  // 更新挑戰賽表格
  var 挑戰賽表格 = $('#挑戰賽表格').DataTable();
  挑戰賽表格.clear().draw();
  挑戰賽表格.rows.add(挑戰賽資料);
  挑戰賽表格.draw();

  $("#新增挑戰賽畫面").hide();
  $("#挑戰賽表格").show();
  $("#spacerBetweenTables").show();
  $("#挑戰賽歷史表格").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#挑戰賽表格_paginate').show();
  $('#挑戰賽歷史表格_paginate').show();

  $("#挑戰賽標題").show();
  $("#addChallengeBtn").show();
  $("#refreshBtn").show();
  //      $("#addChallengeBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);      
}

function 取消新增挑戰賽() {
  console.log("取消新增挑戰賽");
  //挑戰賽最新編號--;
  $("#新增挑戰賽畫面").hide();
  $("#spacerBetweenTables").show();
  $("#挑戰賽歷史表格").show();
  $("#挑戰賽表格").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#挑戰賽表格_paginate').show();
  $('#挑戰賽歷史表格_paginate').show();

  $("#挑戰賽標題").show();
  $("#addChallengeBtn").show();
  $("#refreshBtn").show();
  //      $("#addChallengeBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);       
}

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // always return a string
}

function refreshCourse() {
  console.log("Refresh Course");

  var 挑戰賽表格 = $("#挑戰賽表格").DataTable();
  挑戰賽表格.clear().draw();
  挑戰賽表格.rows.add(挑戰賽資料);
  挑戰賽表格.draw();

  var 挑戰賽歷史表格 = $('#挑戰賽歷史表格').DataTable();
  挑戰賽歷史表格.clear().draw();
  挑戰賽歷史表格.rows.add(挑戰賽歷史資料);
  挑戰賽歷史表格.draw();
}

function  回挑戰賽管理() {
  console.log("Refresh Course");

  $("#挑戰賽細節畫面").hide();

  $("#挑戰賽表格").show();
  $("#挑戰賽歷史表格").show();
  $("#spacerBetweenTables").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#挑戰賽表格_paginate').show();
  $('#挑戰賽歷史表格_paginate').show();
  $("#新增挑戰賽畫面").hide();
  $("#挑戰賽標題").show();
  $("#addChallengeBtn").show();
  $("#refreshBtn").show();
}

function 更新挑戰賽資料() {
  console.log("更新挑戰賽資料");

  if (!isLogin) {
    alert("必須登入後才能更新挑戰賽");
    return 0;
  }

  var securityNum = Math.floor(Math.random()*8999+1000); 
  var securityStr = "確定要更新此挑戰賽，請輸入確認碼: " + String(securityNum);
  //console.log(prompt(securityStr));
  var confirmIt = prompt(securityStr) == securityNum;
  console.log("確認碼:", confirmIt);  

  if (!confirmIt) {
    alert("確認碼輸入錯誤，不進行更新動作");
    return 0;
  } else {
    var dataToReplace = [
      挑戰賽編號,
      $("#挑戰賽細節內容").val(),
      $("#挑戰賽細節有效期限").val(),
      $("#挑戰賽細節其他說明").val(),
    ];

    //console.log(dataToReplace);
    
    // 尋找 挑戰賽資料 這筆資料，並取代
    for (var i =0; i< 挑戰賽資料.length; i++){
      //console.log(挑戰賽資料[i][0]);
      if (挑戰賽資料[i][0]==挑戰賽編號) {
        挑戰賽資料[i] = dataToReplace;
        break;
      }
    }
        
    // 挑戰賽寫入資料庫
    database.ref('users/林口運動中心/挑戰賽').set({
      現在挑戰賽: JSON.stringify(挑戰賽資料),
      過去挑戰賽: JSON.stringify(挑戰賽歷史資料),
    }, function (error) {
      if (error) {
        console.log("Write to database error, revert 挑戰賽資料 back");
        挑戰賽資料.pop();
      }
      console.log('Write to database successful');
    });

    // 更新挑戰賽表格
    var 挑戰賽表格 = $('#挑戰賽表格').DataTable();
    挑戰賽表格.clear().draw();
    挑戰賽表格.rows.add(挑戰賽資料);
    挑戰賽表格.draw();

    $("#挑戰賽細節畫面").hide();
    $("#挑戰賽表格").show();
    $("#spacerBetweenTables").show();
    $("#挑戰賽歷史表格").show();

    $(".dataTables_filter").show();
    $(".dataTables_info").show();
    $('#挑戰賽表格_paginate').show();
    $('#挑戰賽歷史表格_paginate').show();

    $("#挑戰賽標題").show();
    $("#addChallengeBtn").show();
    $("#refreshBtn").show();    

  }

}

function logInAndOut() {
  //  if (!isLogin) {
  //    $("#password").val("");
  //    $("#loginDiv").show();
  //  } else {
  //    firebase.auth().signOut();
  console.log(isLogin);
  if (!isLogin) {
    window.location.href = '0-login.html';
  } else {
    firebase.auth().signOut();
  }
}

//function signIn() {
//  //check email
//  if (!validateEmail($("#emailAddress").val())) {
//    $("#emailAddress").val("");
//    $("#emailAddress").attr("placeholder", "Email Address Error, try again!");
//    $("#emailAddress").css("background-color", "yellow");
//  } else {
//    $("#loginDiv").hide();
//    firebase.auth().signInWithEmailAndPassword($("#emailAddress").val(), $("#password").val()).catch(function (error) {
//      // Handle Errors here.
//      var errorCode = error.code;
//      var errorMessage = error.message;
//      alert("Login Error! Try again!")
//    });
//  }
//
//}

//function validateEmail(email) {
//  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//
//  return re.test(String(email).toLowerCase());
//}
//
//
//function signInAbort() {
//  $("#loginDiv").hide();
//}

//function addNewCoach() {
//  console.log("Query and Check coach");
//
//  var coachs = $('#coachList').DataTable();
//  coachs.clear().draw();
//  coachs.rows.add(coachSet);
//  coachs.draw();
//
//  $("#新增挑戰賽畫面").hide();
//  $("#coachTable").show();
//  $("#coachList_paginate").css({
//    "font-size": "16px"
//  });

//}



function memberManage() {
  console.log("客戶管理");

  if (!isLogin) {
    alert("必須登入後才能進行客戶管理");
    return 0;
  }

  window.location.href = '1-addMember.html';

  //  $("#memberDiv").show();
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add(會員資料);
  //  memberTable.draw();
}

function closeMember() {
  console.log("關閉客戶管理");

  $("#memberDiv").hide();
}

function addMember() {
  console.log("新增客戶");

  $("#memberDiv").hide();
  $("#addMemberInfo").show();
}

function closeAddMember() {
  console.log("close addMemberInfo");
  $("#addMemberInfo").hide();
  $("#memberDiv").show();
}

function addMemberInfo() {
  console.log("確定新增會員");

  if (!isLogin) {
    alert("必須登入後才能進行新增客戶");
    return 0;
  }

  var dataToAdd = [
            $("#newMemberName").val(),
            $("#newMemberLINEId").val(),
            $("#newMemberGender").val(),
            $("#newMemberBirth").val(),
            $("#newMemberPhoneNum").val(),
            $("#newMemberIdNum").val(),
            $("#newMemberAssress").val(),
          ];

  //console.log(dataToAdd);

  // 會員資料 取回 完整的 LINE Id
  會員資料.forEach(function(member, index, array){
    member[1]=memberLineId[index];
  });
  
  // 更新 local 挑戰賽資料
  會員資料.push(dataToAdd);


  // 客戶寫入資料庫
  database.ref('users/林口運動中心/客戶管理').set({
    會員資料: JSON.stringify(會員資料),
  }, function (error) {
    if (error) {
      console.log("Write to database error");
      挑戰賽資料.pop();
    }
    console.log('Write to database successful');
  });


  // 更新客戶表格  
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add(會員資料);
  //  memberTable.draw();  
  //  
  //  $("#addMemberInfo").hide();
  //  $("#memberDiv").show(); 

}