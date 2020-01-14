function initMainPage() {
  $("#loginDiv").hide();
  $("#addChallengeDiv").hide();
//  $("#coachTable").hide();
//  $("#couponDetailDiv").hide();
  $("#newCoachInfo").hide();
  $("#memberDiv").hide();
  $("#addMemberInfo").hide();
  

  var challengeTable = $('#challengeTable').DataTable({
    order: [[ 0, "desc" ]],
    data: couponData,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "挑戰賽編號"
        className: "centerCell"
              },
      {
        //title: "挑戰賽內容", 不對中，對左
              },
      {
        //title: "有效期限"
        className: "centerCell"
              },

      {
        //title: "操作",
        data: null,
        defaultContent: "<button id='couponDueBtn' class = 'dueButton to-edit'>到期</button> " +
          "<button id='couponDetailBtn' class = 'detailButton to-edit'>詳細</button> " +
          "<button id='couponDeleteBtn' class = 'deleteButton to-delete'>刪除</button>"
              }
            ]
  });

  $('#challengeTable tbody').on('click', '.dueButton', function () {
    console.log("Due is clicked");

    if (!isLogin) {
      alert("必須登入後才能修改");
      return 0;
    }
  
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定要將挑戰賽過期!無法回復! 請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行挑戰賽過期動作");
      return 0;     
    }
    
    var data = challengeTable.row($(this).parents('tr')).data();
    console.log("delete:" + data[0]);

    couponHistory.push(data);

    couponData = couponData.filter(function (value, index, arr) {
      return value[0] != data[0];
    });

    // 更新 couponNum
    if (couponData.length>0) {
      var tmp1 = couponData[couponData.length - 1][0];
      var tmp2 = parseInt(tmp1.substr(1, 4));
    } else tmp2 = 0;

    if (couponHistory.length>0) {    
      var tmp3 = couponHistory[couponHistory.length - 1][0];
      var tmp4 = parseInt(tmp3.substr(1, 4));  
    } else tmp4 = 0;

    couponNum = (tmp4 > tmp2)? tmp4:tmp2;

    // 更新 database
    database.ref('users/林口運動中心/挑戰賽').set({
      現在挑戰賽: JSON.stringify(couponData),
      過去挑戰賽: JSON.stringify(couponHistory),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });

    challengeTable.clear().draw();
    challengeTable.rows.add(couponData);
    challengeTable.draw();

    challengeHistoryTable.clear().draw();
    challengeHistoryTable.rows.add(couponHistory);
    challengeHistoryTable.draw();

  });

  $('#challengeTable tbody').on('click', '.detailButton', function () {
    console.log("Detail is clicked");
    
    if (!isLogin) {
      alert("必須登入後才能查看");
      return 0;
    }    
    
    couponMemberSet=[];

    $("#challengeTable").hide();
    $("#challengeHistoryTable").hide();
    $("#spacerBetweenTables").hide();

    //$(".dataTables_filter").hide();
    //$(".dataTables_info").hide();
    $('#challengeTable_filter').hide();
    $('#challengeTable_info').hide();
    $('#challengeTable_paginate').hide();
    $('#challengeHistoryTable_filter').hide();
    $('#challengeHistoryTable_info').hide();
    $('#challengeHistoryTable_paginate').hide();
    $("#addChallengeDiv").hide();
    $("#inProgress").hide();
    $("#addChallengeBtn").hide();
    $("#refreshBtn").hide();

    $("#couponMemberTable_filter").css({
      "font-size": "16px"
    });
    $("#couponMemberTable_info").css({
      "font-size": "16px"
    });
    $("#couponMemberTable_paginate").css({
      "font-size": "16px"
    });

    var data = challengeTable.row($(this).parents('tr')).data();
    //console.log("detail:" + data[0]);

    $("#challengeDetailHeader").text("挑戰賽頁面 - " + data[0] + " "+ data[1]);
    
    couponNumber = data[0];

    $("#couponDetail").val(data[1]);
    $("#couponDateDetail").val(data[2]);
    $("#couponOtherDescDetail").val(data[3]);

    couponMember.forEach(function (item, index, array) {
      if (item[0] == data[0]) {
        item.shift();

        var tmp1 = [];
        item.forEach(function (item1, index, array) {
          memberData.forEach(function (item2, index, array) {
            if (item1[0] == item2[0]) {
              tmp1 = item2;
            };
          });

          // Convert 
          var dataToAdd = tmp1.slice(0, 1);

          dataToAdd.push(item1[1], item1[2]);

          couponMemberSet.push(dataToAdd);
        });

        item.unshift(data[0]);
      }
    });

    couponMemberTable.clear().draw();
    couponMemberTable.rows.add(couponMemberSet);
    couponMemberTable.draw();

    $("#couponDetailDiv").show();

  });

  $("#challengeTable tbody").on('click', '.deleteButton', function () {
    // delete button
    console.log("delete:");
    if (!isLogin) {
      alert("必須登入後才能刪除");
      return 0;
    }
  
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定要刪除此挑戰賽!無法回復! 請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行挑戰賽刪除動作");
      return 0;     
    }    

    var data = challengeTable.row($(this).parents('tr')).data();
    

    //console.log("dddd");
    couponData = couponData.filter(function (value, index, arr) {
      return value[0] != data[0];
    });

    // 更新 couponNum
    if (couponData.length>0) {
      var tmp1 = couponData[couponData.length - 1][0];
      var tmp2 = parseInt(tmp1.substr(1, 4));
    } else tmp2 = 0;

    if (couponHistory.length>0) {    
      var tmp3 = couponHistory[couponHistory.length - 1][0];
      var tmp4 = parseInt(tmp3.substr(1, 4));  
    } else tmp4 = 0;

    couponNum = (tmp4 > tmp2)? tmp4:tmp2;

    // 更新 database
    database.ref('users/林口運動中心/挑戰賽').set({
      現在挑戰賽: JSON.stringify(couponData),
      過去挑戰賽: JSON.stringify(couponHistory),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });

    couponMember = couponMember.filter(function (value, index, arr) {
      return value[0] != data[0];
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

    console.log(couponData);
    challengeTable.clear().draw();
    challengeTable.rows.add(couponData);
    challengeTable.draw();

  });

  var challengeHistoryTable = $('#challengeHistoryTable').DataTable({
    order: [[ 0, "desc" ]],
    data: couponHistory,
    pageLength: 8,
    deferRender: true,
    lengthChange: false,
    columns: [{ //title: "挑戰賽編號"
        className: "centerCell"
              },
      {
        //title: "挑戰賽內容", 不對中，對左
              },
      {
        //title: "有效期限"
        className: "centerCell"
              },

      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class='copyButton to-edit' style='width: 150px'>複製新增挑戰賽</button>" 
              }              

            ]
  });
  
  $('#challengeHistoryTable tbody').on('click', '.copyButton', function () {
    console.log("Copy coupon");
    
    var data = challengeHistoryTable.row($(this).parents('tr')).data();     

    console.log(data);
    $("#couponName").val(data[1]);
    //$("#couponDate").val(data[2]);
    $("#couponOtherDesc").val(data[3]);

    
    addChallenge();
      
  });

  var couponMemberTable = $('#couponMemberTable').DataTable({
    order: [[ 2, "desc" ]],
    data: couponMemberSet,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "挑戰賽編號"
        className: "centerCell"
              },
//      { //title: "挑戰賽內容"
//        //className: "centerCell"
//              },
      {
        //title: "使用"
        className: "centerCell"
              },
      {
        //title: "確認"
        className: "centerCell"
              },
      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class = 'cancelUsingCoupon to-edit' style='width:80px'>取消使用</button> " 
                      + "<button class = 'confirmUsingCoupon to-edit' style='width:90px'>確認使用</button> "      
       
              }
            ]
  });
  
  $('#couponMemberTable tbody').on('click', '.cancelUsingCoupon', function () {
    console.log("cancelUsingCoupon is clicked");
    
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定取消挑戰賽使用，請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行取消動作");
      return 0;     
    }
    

    //var data = couponMemberTable.row($(this)).data();
    var data = couponMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCoupon;
    var thisIndex;
    couponMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== couponNumber) {
        //console.log(item, data[0]);
        thisCoupon = item;
        thisIndex = index;
      }
    });
      
    //console.log(thisCourse, thisIndex, data[0]);
      
    var thisCouponLength = thisCoupon.length;
    var thisI;
    for (var i = 0; i < thisCouponLength; i++) {
      if (thisCoupon[i][0] == data[0]) {
        //console.log(thisCoupon[i], thisIndex, i);
        thisI = i;
      };
    }   
    
    //console.log(couponMember[thisIndex][thisI][0],couponMember[thisIndex][thisI][1]);
    //couponMember[thisIndex][thisI][1] = "未使用";
    couponMember[thisIndex].splice(thisI, 1);

    // Update couponMemberSet 及其 Table  
    for (var i=0; i< couponMemberSet.length; i++){
      //console.log(couponMemberSet[i][0], data[0]);
      if (couponMemberSet[i][0] == data[0]) {
        //console.log("match");
        //couponMemberSet[i][1] = "未使用";
        thisI = i;
      };
    };
    
    couponMemberSet.splice(thisI, 1);
    
    var table = $('#couponMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(couponMemberSet);
    table.draw();    
    
    // Write couponMember to database
    database.ref('users/林口運動中心/挑戰賽管理').set({
      挑戰賽會員: JSON.stringify(couponMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    }); 
    
  });

  $('#couponMemberTable tbody').on('click', '.confirmUsingCoupon', function () {
    console.log("confirmUsingCoupon is clicked");
    
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定使用挑戰賽，請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行確認動作");
      return 0;    
    }    

    //var data = couponMemberTable.row($(this)).data();
    var data = couponMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCourse;
    var thisIndex;
    couponMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== couponNumber) {
        //console.log(item, data[0]);
        thisCourse = item;
        thisIndex = index;
      }
    });
      
    //console.log(thisCourse, thisIndex, data[0]);
      
    var thisCourseLength = thisCourse.length;
    var thisI;
    for (var i = 0; i < thisCourseLength; i++) {
      if (thisCourse[i][0] == data[0]) {
        //console.log(thisCourse[i], thisIndex, i);
        thisI = i;
      };
    }   
    
    //console.log(couponMember[thisIndex][thisI][2]);
    couponMember[thisIndex][thisI][2] = "已確認";

    // Update couponMemberSet 及其 Table
    for (var i=0; i< couponMemberSet.length; i++){
      //console.log(couponMemberSet[i][0], data[0]);
      if (couponMemberSet[i][0] == data[0]) {
        //console.log("match");
        couponMemberSet[i][2] = "已確認";
      };
    };
    
    var table = $('#couponMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(couponMemberSet);
    table.draw();  
    
    // Write couponMember to database
    database.ref('users/林口運動中心/挑戰賽管理').set({
      挑戰賽會員: JSON.stringify(couponMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });
    
  });  

  $("#couponDetailDiv").hide();
  
//  $('#couponMemberTable tbody').on('click', '.resetButton', function () {
//    var confirmIt = confirm("請確定要重置!");
//    if (!confirmIt) return 0;
//    
//    console.log("resetButton is clicked");
//
//    //var data = couponMemberTable.row($(this)).data();
//    var data = couponMemberTable.row($(this).parents('tr')).data();    
//    //console.log(data[0]);
//    
//    var thisCourse;
//    var thisIndex;
//    couponMember.forEach(function(item, index, array) {
//      //console.log(item[1][0]);
//      if (item[0]== couponNumber) {
//        //console.log(item, data[0]);
//        thisCourse = item;
//        thisIndex = index;
//      }
//    });
//      
//    //console.log(thisCourse, thisIndex, data[0]);
//      
//    var thisCourseLength = thisCourse.length;
//    var thisI;
//    for (var i = 0; i < thisCourseLength; i++) {
//      if (thisCourse[i][0] == data[0]) {
//        //console.log(thisCourse[i], thisIndex, i);
//        thisI = i;
//      };
//    }   
//    
//    //console.log(couponMember[thisIndex][thisI][0],couponMember[thisIndex][thisI][1]);
//    couponMember[thisIndex][thisI][1] = "未繳費";
//    couponMember[thisIndex][thisI][2] = "未簽到";
//
//    // Update couponMemberSet 及其 Table  
//    for (var i=0; i< couponMemberSet.length; i++){
//      //console.log(couponMemberSet[i][0], data[0]);
//      if (couponMemberSet[i][0] == data[0]) {
//        //console.log("match");
//        couponMemberSet[i][5] = "未繳費";
//        couponMemberSet[i][6] = "未簽到";
//      };
//    };
//    
//    var table = $('#couponMemberTable').DataTable();
//    table.clear().draw();
//    table.rows.add(couponMemberSet);
//    table.draw();    
//    
//    // Write couponMember to database
//    database.ref('users/林口運動中心/挑戰賽管理').set({
//      挑戰賽會員: JSON.stringify(couponMember),
//    }, function (error) {
//      if (error) {
//        //console.log(error);
//        return 0;
//      }
//      console.log('Write to database successful');
//    });
//    
//  });
  
}



var coachList = $('#coachList').DataTable({
  data: coachSet,
  //ordering: false,
  pageLength: 14,
  lengthChange: false,
  deferRender: true,
  columns: [
    { //title: "老師姓名"
      className: "centerCell"
    },
    {
      //title: "性別"
      className: "centerCell"
    },
    {
      //title: "其他說明"
    }
  ]
});

$('#coachList tbody').on('click', 'tr', function () {
  console.log("coach is clicked");


  var data = coachList.row($(this)).data();
  console.log(data);
  $("#couponName").val(data[0]);
  $("#addChallengeDiv").show();
//  $("#coachTable").hide();

});