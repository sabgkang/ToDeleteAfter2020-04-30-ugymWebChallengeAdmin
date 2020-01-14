function addChallenge() {
  console.log("addCoupon");

  if (!isLogin) {
    alert("必須登入後才能新增挑戰賽");
    return 0;
  }

  //couponNum++;
  $("#addNewChallengeHeader").text("新增挑戰賽 - T" + zeroFill(couponNum+1, 4));

  $("#challengeTable").hide();
  $("#challengeHistoryTable").hide();
  $("#spacerBetweenTables").hide();

  $(".dataTables_filter").hide();
  $(".dataTables_info").hide();
  $('#challengeTable_paginate').hide();
  $('#challengeHistoryTable_paginate').hide();

  $("#addChallengeDiv").show();


  $("#inProgress").hide();
  $("#addChallengeBtn").hide();
  $("#refreshBtn").hide();
  //      $("#addChallengeBtn").attr("disabled", true);
  //      $("#refreshBtn").attr("disabled", true);
}

function couponConfirm() {
  console.log("couponConfirm");

  if (!isLogin) {
    alert("必須登入後才能新增挑戰賽");
    return 0;
  }

  var startDate = new Date($("#couponDate").val());
  var nextDate = new Date();
  //console.log(startDate);
  nextDate.setDate(startDate.getDate() - 7);
  var repeatTimes=$("#repeatN").val();
  for (var i=0; i<repeatTimes; i++){
    couponNum++;
    nextDate.setDate(nextDate.getDate() + 7);
    nextDateStr = nextDate.toLocaleDateString();
    nextDateStr = nextDateStr.replace(/\//g, "-");
    //console.log(couponNum, nextDateStr);
    
    if(nextDate == "Invalid Date") {
      alert("有效期限日期錯誤");
      return 0;
    }
    
    var couponNameTmp;
    couponNameTmp = (repeatTimes>1)? $("#couponName").val()+" ("+(i+1)+")":$("#couponName").val();
    
    var dataToAdd = [
              "C" + zeroFill(couponNum, 4),
              couponNameTmp,
              //$("#couponName").val(),
              nextDateStr,
              $("#couponOtherDesc").val()
            ];

    console.log(dataToAdd);
    
    // 更新 local couponData 及 couponMember
    couponData.push(dataToAdd);
    couponMember.push(["C" + zeroFill(couponNum, 4)]); //Fix bug:重複週期 新增挑戰賽 會只有增加最後一個挑戰賽 到 couponMember
  }
  


  // 挑戰賽寫入資料庫
  database.ref('users/林口運動中心/挑戰賽').set({
    現在挑戰賽: JSON.stringify(couponData),
    過去挑戰賽: JSON.stringify(couponHistory),
  }, function (error) {
    if (error) {
      console.log("Write to database error, revert couponData back");
      couponData.pop();
    }
    console.log('Write to database successful');
  });


  database.ref('users/林口運動中心/挑戰賽管理').set({
    挑戰賽會員: JSON.stringify(couponMember),
  }, function (error) {
    if (error) {
      //console.log(error);
      return 0;
    }
    console.log('Write to database successful');
  });

  // 更新挑戰賽表格
  var challengeTable = $('#challengeTable').DataTable();
  challengeTable.clear().draw();
  challengeTable.rows.add(couponData);
  challengeTable.draw();

  $("#addChallengeDiv").hide();
  $("#challengeTable").show();
  $("#spacerBetweenTables").show();
  $("#challengeHistoryTable").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#challengeTable_paginate').show();
  $('#challengeHistoryTable_paginate').show();

  $("#inProgress").show();
  $("#addChallengeBtn").show();
  $("#refreshBtn").show();
  //      $("#addChallengeBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);      
}

function couponCancel() {
  console.log("couponCancel");
  //couponNum--;
  $("#addChallengeDiv").hide();
  $("#spacerBetweenTables").show();
  $("#challengeHistoryTable").show();
  $("#challengeTable").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#challengeTable_paginate').show();
  $('#challengeHistoryTable_paginate').show();

  $("#inProgress").show();
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

  var challengeTable = $("#challengeTable").DataTable();
  challengeTable.clear().draw();
  challengeTable.rows.add(couponData);
  challengeTable.draw();

  var challengeHistoryTable = $('#challengeHistoryTable').DataTable();
  challengeHistoryTable.clear().draw();
  challengeHistoryTable.rows.add(couponHistory);
  challengeHistoryTable.draw();
}

function backToHome() {
  console.log("Refresh Course");

  $("#couponDetailDiv").hide();

  $("#challengeTable").show();
  $("#challengeHistoryTable").show();
  $("#spacerBetweenTables").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#challengeTable_paginate').show();
  $('#challengeHistoryTable_paginate').show();
  $("#addChallengeDiv").hide();
  $("#inProgress").show();
  $("#addChallengeBtn").show();
  $("#refreshBtn").show();
}

function couponUpdate() {
  console.log("couponUpdate");

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
      couponNumber,
      $("#couponDetail").val(),
      $("#couponDateDetail").val(),
      $("#couponOtherDescDetail").val(),
    ];

    //console.log(dataToReplace);
    
    // 尋找 couponData 這筆資料，並取代
    for (var i =0; i< couponData.length; i++){
      //console.log(couponData[i][0]);
      if (couponData[i][0]==couponNumber) {
        couponData[i] = dataToReplace;
        break;
      }
    }
        
    // 挑戰賽寫入資料庫
    database.ref('users/林口運動中心/挑戰賽').set({
      現在挑戰賽: JSON.stringify(couponData),
      過去挑戰賽: JSON.stringify(couponHistory),
    }, function (error) {
      if (error) {
        console.log("Write to database error, revert couponData back");
        couponData.pop();
      }
      console.log('Write to database successful');
    });

    // 更新挑戰賽表格
    var challengeTable = $('#challengeTable').DataTable();
    challengeTable.clear().draw();
    challengeTable.rows.add(couponData);
    challengeTable.draw();

    $("#couponDetailDiv").hide();
    $("#challengeTable").show();
    $("#spacerBetweenTables").show();
    $("#challengeHistoryTable").show();

    $(".dataTables_filter").show();
    $(".dataTables_info").show();
    $('#challengeTable_paginate').show();
    $('#challengeHistoryTable_paginate').show();

    $("#inProgress").show();
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
//  $("#addChallengeDiv").hide();
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
  //  memberTable.rows.add(memberData);
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

  // memberData 取回 完整的 LINE Id
  memberData.forEach(function(member, index, array){
    member[1]=memberLineId[index];
  });
  
  // 更新 local couponData
  memberData.push(dataToAdd);


  // 客戶寫入資料庫
  database.ref('users/林口運動中心/客戶管理').set({
    會員資料: JSON.stringify(memberData),
  }, function (error) {
    if (error) {
      console.log("Write to database error");
      couponData.pop();
    }
    console.log('Write to database successful');
  });


  // 更新客戶表格  
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add(memberData);
  //  memberTable.draw();  
  //  
  //  $("#addMemberInfo").hide();
  //  $("#memberDiv").show(); 

}