function initMainPage() {
  $("#loginDiv").hide();
  $("#新增挑戰賽畫面").hide();
//  $("#coachTable").hide();
//  $("#挑戰賽細節畫面").hide();
  $("#newCoachInfo").hide();
  $("#memberDiv").hide();
  $("#addMemberInfo").hide();
  

  var 挑戰賽表格 = $('#挑戰賽表格').DataTable({
    order: [[ 0, "desc" ]],
    data: 挑戰賽資料,
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

  $('#挑戰賽表格 tbody').on('click', '.dueButton', function () {
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
    
    var data = 挑戰賽表格.row($(this).parents('tr')).data();
    console.log("delete:" + data[0]);

    挑戰賽歷史資料.push(data);

    挑戰賽資料 = 挑戰賽資料.filter(function (value, index, arr) {
      return value[0] != data[0];
    });

    // 更新 挑戰賽最新編號
    if (挑戰賽資料.length>0) {
      var tmp1 = 挑戰賽資料[挑戰賽資料.length - 1][0];
      var tmp2 = parseInt(tmp1.substr(1, 4));
    } else tmp2 = 0;

    if (挑戰賽歷史資料.length>0) {    
      var tmp3 = 挑戰賽歷史資料[挑戰賽歷史資料.length - 1][0];
      var tmp4 = parseInt(tmp3.substr(1, 4));  
    } else tmp4 = 0;

    挑戰賽最新編號 = (tmp4 > tmp2)? tmp4:tmp2;

    // 更新 database
    database.ref('users/林口運動中心/挑戰賽').set({
      現在挑戰賽: JSON.stringify(挑戰賽資料),
      過去挑戰賽: JSON.stringify(挑戰賽歷史資料),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });

    挑戰賽表格.clear().draw();
    挑戰賽表格.rows.add(挑戰賽資料);
    挑戰賽表格.draw();

    挑戰賽歷史表格.clear().draw();
    挑戰賽歷史表格.rows.add(挑戰賽歷史資料);
    挑戰賽歷史表格.draw();

  });

  $('#挑戰賽表格 tbody').on('click', '.detailButton', function () {
    console.log("Detail is clicked");
    
    if (!isLogin) {
      alert("必須登入後才能查看");
      return 0;
    }    
    
    挑戰賽會員對應=[];

    $("#挑戰賽表格").hide();
    $("#挑戰賽歷史表格").hide();
    $("#spacerBetweenTables").hide();

    //$(".dataTables_filter").hide();
    //$(".dataTables_info").hide();
    $('#挑戰賽表格_filter').hide();
    $('#挑戰賽表格_info').hide();
    $('#挑戰賽表格_paginate').hide();
    $('#挑戰賽歷史表格_filter').hide();
    $('#挑戰賽歷史表格_info').hide();
    $('#挑戰賽歷史表格_paginate').hide();
    $("#新增挑戰賽畫面").hide();
    $("#挑戰賽標題").hide();
    $("#addChallengeBtn").hide();
    $("#refreshBtn").hide();

    $("#挑戰賽會員表格_filter").css({
      "font-size": "16px"
    });
    $("#挑戰賽會員表格_info").css({
      "font-size": "16px"
    });
    $("#挑戰賽會員表格_paginate").css({
      "font-size": "16px"
    });

    var data = 挑戰賽表格.row($(this).parents('tr')).data();
    //console.log("detail:" + data[0]);

    $("#挑戰賽頁面標題").text("挑戰賽頁面 - " + data[0] + " "+ data[1]);
    
    挑戰賽編號 = data[0];

    $("#挑戰賽細節內容").val(data[1]);
    $("#挑戰賽細節有效期限").val(data[2]);
    $("#挑戰賽細節其他說明").val(data[3]);

    挑戰賽會員.forEach(function (item, index, array) {
      if (item[0] == data[0]) {
        item.shift();

        var tmp1 = [];
        item.forEach(function (item1, index, array) {
          會員資料.forEach(function (item2, index, array) {
            if (item1[0] == item2[0]) {
              tmp1 = item2;
            };
          });

          // Convert 
          var dataToAdd = tmp1.slice(0, 1);

          dataToAdd.push(item1[1], item1[2]);

          挑戰賽會員對應.push(dataToAdd);
        });

        item.unshift(data[0]);
      }
    });

    挑戰賽會員表格.clear().draw();
    挑戰賽會員表格.rows.add(挑戰賽會員對應);
    挑戰賽會員表格.draw();

    $("#挑戰賽細節畫面").show();

  });

  $("#挑戰賽表格 tbody").on('click', '.deleteButton', function () {
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

    var data = 挑戰賽表格.row($(this).parents('tr')).data();
    

    //console.log("dddd");
    挑戰賽資料 = 挑戰賽資料.filter(function (value, index, arr) {
      return value[0] != data[0];
    });

    // 更新 挑戰賽最新編號
    if (挑戰賽資料.length>0) {
      var tmp1 = 挑戰賽資料[挑戰賽資料.length - 1][0];
      var tmp2 = parseInt(tmp1.substr(1, 4));
    } else tmp2 = 0;

    if (挑戰賽歷史資料.length>0) {    
      var tmp3 = 挑戰賽歷史資料[挑戰賽歷史資料.length - 1][0];
      var tmp4 = parseInt(tmp3.substr(1, 4));  
    } else tmp4 = 0;

    挑戰賽最新編號 = (tmp4 > tmp2)? tmp4:tmp2;

    // 更新 database
    database.ref('users/林口運動中心/挑戰賽').set({
      現在挑戰賽: JSON.stringify(挑戰賽資料),
      過去挑戰賽: JSON.stringify(挑戰賽歷史資料),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });

    挑戰賽會員 = 挑戰賽會員.filter(function (value, index, arr) {
      return value[0] != data[0];
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

    console.log(挑戰賽資料);
    挑戰賽表格.clear().draw();
    挑戰賽表格.rows.add(挑戰賽資料);
    挑戰賽表格.draw();

  });

  var 挑戰賽歷史表格 = $('#挑戰賽歷史表格').DataTable({
    order: [[ 0, "desc" ]],
    data: 挑戰賽歷史資料,
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
  
  $('#挑戰賽歷史表格 tbody').on('click', '.copyButton', function () {
    console.log("Copy coupon");
    
    var data = 挑戰賽歷史表格.row($(this).parents('tr')).data();     

    console.log(data);
    $("#新增挑戰賽內容").val(data[1]);
    //$("#挑戰賽起始時間").val(data[2]);
    $("#新增挑戰賽其他說明").val(data[3]);

    
    addChallenge();
      
  });

  var 挑戰賽會員表格 = $('#挑戰賽會員表格').DataTable({
    order: [[ 2, "desc" ]],
    data: 挑戰賽會員對應,
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
        //title: "參加"
        className: "centerCell"
              },
      {
        //title: "繳費"
        className: "centerCell"
              },
      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class = '取消參加挑戰賽 to-edit' style='width:80px'>取消參加</button> " 
                      + "<button class = '確認繳費 to-edit' style='width:90px'>確認繳費</button> "      
       
              }
            ]
  });
  
  $('#挑戰賽會員表格 tbody').on('click', '.取消參加挑戰賽', function () {
    console.log("取消參加挑戰賽 is clicked");
    
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定取消挑戰賽使用，請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行取消動作");
      return 0;     
    }
    

    //var data = 挑戰賽會員表格.row($(this)).data();
    var data = 挑戰賽會員表格.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCoupon;
    var thisIndex;
    挑戰賽會員.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== 挑戰賽編號) {
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
    
    //console.log(挑戰賽會員[thisIndex][thisI][0],挑戰賽會員[thisIndex][thisI][1]);
    //挑戰賽會員[thisIndex][thisI][1] = "未使用";
    挑戰賽會員[thisIndex].splice(thisI, 1);

    // Update 挑戰賽會員對應 及其 Table  
    for (var i=0; i< 挑戰賽會員對應.length; i++){
      //console.log(挑戰賽會員對應[i][0], data[0]);
      if (挑戰賽會員對應[i][0] == data[0]) {
        //console.log("match");
        //挑戰賽會員對應[i][1] = "未使用";
        thisI = i;
      };
    };
    
    挑戰賽會員對應.splice(thisI, 1);
    
    var table = $('#挑戰賽會員表格').DataTable();
    table.clear().draw();
    table.rows.add(挑戰賽會員對應);
    table.draw();    
    
    // Write 挑戰賽會員 to database
    database.ref('users/林口運動中心/挑戰賽管理').set({
      挑戰賽會員: JSON.stringify(挑戰賽會員),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    }); 
    
  });

  $('#挑戰賽會員表格 tbody').on('click', '.確認繳費', function () {
    console.log("確認繳費 is clicked");
    
    var securityNum = Math.floor(Math.random()*8999+1000); 
    var securityStr = "確定參加挑戰賽，請輸入確認碼: " + String(securityNum);
    //console.log(prompt(securityStr));
    var confirmIt = prompt(securityStr) == securityNum;
    console.log("確認碼:", confirmIt);
    
    if (!confirmIt) {
      alert("確認碼輸入錯誤，不進行確認動作");
      return 0;    
    }    

    //var data = 挑戰賽會員表格.row($(this)).data();
    var data = 挑戰賽會員表格.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCourse;
    var thisIndex;
    挑戰賽會員.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== 挑戰賽編號) {
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
    
    //console.log(挑戰賽會員[thisIndex][thisI][2]);
    挑戰賽會員[thisIndex][thisI][2] = "已繳費";

    // Update 挑戰賽會員對應 及其 Table
    for (var i=0; i< 挑戰賽會員對應.length; i++){
      //console.log(挑戰賽會員對應[i][0], data[0]);
      if (挑戰賽會員對應[i][0] == data[0]) {
        //console.log("match");
        挑戰賽會員對應[i][2] = "已繳費";
      };
    };
    
    var table = $('#挑戰賽會員表格').DataTable();
    table.clear().draw();
    table.rows.add(挑戰賽會員對應);
    table.draw();  
    
    // Write 挑戰賽會員 to database
    database.ref('users/林口運動中心/挑戰賽管理').set({
      挑戰賽會員: JSON.stringify(挑戰賽會員),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });
    
  });  

  $("#挑戰賽細節畫面").hide();
  
//  $('#挑戰賽會員表格 tbody').on('click', '.resetButton', function () {
//    var confirmIt = confirm("請確定要重置!");
//    if (!confirmIt) return 0;
//    
//    console.log("resetButton is clicked");
//
//    //var data = 挑戰賽會員表格.row($(this)).data();
//    var data = 挑戰賽會員表格.row($(this).parents('tr')).data();    
//    //console.log(data[0]);
//    
//    var thisCourse;
//    var thisIndex;
//    挑戰賽會員.forEach(function(item, index, array) {
//      //console.log(item[1][0]);
//      if (item[0]== 挑戰賽編號) {
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
//    //console.log(挑戰賽會員[thisIndex][thisI][0],挑戰賽會員[thisIndex][thisI][1]);
//    挑戰賽會員[thisIndex][thisI][1] = "未繳費";
//    挑戰賽會員[thisIndex][thisI][2] = "未簽到";
//
//    // Update 挑戰賽會員對應 及其 Table  
//    for (var i=0; i< 挑戰賽會員對應.length; i++){
//      //console.log(挑戰賽會員對應[i][0], data[0]);
//      if (挑戰賽會員對應[i][0] == data[0]) {
//        //console.log("match");
//        挑戰賽會員對應[i][5] = "未繳費";
//        挑戰賽會員對應[i][6] = "未簽到";
//      };
//    };
//    
//    var table = $('#挑戰賽會員表格').DataTable();
//    table.clear().draw();
//    table.rows.add(挑戰賽會員對應);
//    table.draw();    
//    
//    // Write 挑戰賽會員 to database
//    database.ref('users/林口運動中心/挑戰賽管理').set({
//      挑戰賽會員: JSON.stringify(挑戰賽會員),
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



//var coachList = $('#coachList').DataTable({
//  data: coachSet,
//  //ordering: false,
//  pageLength: 14,
//  lengthChange: false,
//  deferRender: true,
//  columns: [
//    { //title: "老師姓名"
//      className: "centerCell"
//    },
//    {
//      //title: "性別"
//      className: "centerCell"
//    },
//    {
//      //title: "其他說明"
//    }
//  ]
//});
//
//$('#coachList tbody').on('click', 'tr', function () {
//  console.log("coach is clicked");
//
//
//  var data = coachList.row($(this)).data();
//  console.log(data);
//  $("#新增挑戰賽內容").val(data[0]);
//  $("#新增挑戰賽畫面").show();
////  $("#coachTable").hide();
//
//});