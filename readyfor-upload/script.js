let btnWrap = document.querySelector('.ready-move-btn-wrap');
let nextBtn = document.querySelector('.ready-move-btn-wrap .ready-next-black');
let prevBtn = document.querySelector('.ready-move-btn-wrap .ready-prev-black');
let submitBtn = document.querySelector(
  '.ready-move-btn-wrap .ready-next-red.submit-btn'
);
var order = [1, 2, 3, 4, 5, 6, 7, 8];
var designnum = 0;

function formChange(i) {
  var formWrap = document.querySelectorAll(`input[name="form${order[i]}"]`);
  formWrap.forEach(function (el) {
    el.addEventListener('change', function () {
      if (document.querySelector(`input[name="form${order[i]}"]:checked`)) {
        nextBtn.classList.remove('ready-btn-undo');
      } else {
        nextBtn.classList.add('ready-btn-undo');
      }
    });
  });
}

let sectionName = 'contact';

nextBtn.addEventListener('click', function () {
  var i = btnWrap.dataset.form;
  if (btnWrap.dataset.form == 0) {
    gsap.to(prevBtn, {
      visibility: 'visible',
      opacity: '1',
    });
    sectionName =
      document.querySelector(`input[name="form1"]:checked`).value === 'project'
        ? 'contact'
        : 'members';
  }
  if (sectionName == 'contact') {
    if (btnWrap.dataset.form == 2) {
      var form3 = document.querySelectorAll(
        `#ready-contact-section2 input[name="form2"]:checked`
      );
      var checked3 = [...form3].map(function (el) {
        return el.value;
      });

      if (checked3.length == 2) {
        order.splice(3, 0, '3-1');
      } else if (checked3[0] == 'design') {
        order.splice(2, 1, '3-1');
      }
    }
    if (btnWrap.dataset.form == 3) {
      if (checked3.length == 2) {
        order.splice(3, 0, '3-1');
      } else if (checked3[0] == 'design') {
        order.splice(2, 1, '3-1');
        designnum = 1;
      }
    }

    ++i;
    console.log(order[i]);
    nextBtn.classList.add('ready-btn-undo');
    if (document.querySelector(`input[name="form${order[i]}"]:checked`)) {
      nextBtn.classList.remove('ready-btn-undo');
    }

    btnWrap.dataset.form = i;

    gsap.to(`#ready-${sectionName}-section${order[i + designnum]}`, 1, {
      x: '-100vw',
      ease: Power3.easeOut,
    });

    if (
      btnWrap.dataset.form == 0 + designnum ||
      btnWrap.dataset.form == 1 + designnum ||
      btnWrap.dataset.form == 2 + designnum ||
      btnWrap.dataset.form == 4 + designnum
    ) {
      formChange(i);
    }
    if (btnWrap.dataset.form == 3 + designnum) {
      document.querySelectorAll('.ready-date-btn-wrap button').forEach((el) => {
        el.addEventListener('click', function () {
          var formStartDay = new Date(
            startYear.value,
            startMonth.value,
            startDay.value == '초' ? 10 : startDay.value == '중' ? 20 : 30
          );
          var formEndDay = new Date(
            endYear.value,
            endMonth.value,
            endDay.value == '초' ? 10 : startDay.value == '중' ? 20 : 30
          );
          if (formEndDay - formStartDay > 0) {
            nextBtn.classList.remove('ready-btn-undo');
          } else {
            nextBtn.classList.add('ready-btn-undo');
          }
        });
      });
    }

    if (btnWrap.dataset.form == 5 + designnum) {
      document
        .querySelector('input[type="tel" name="member"]')
        .addEventListener('keyup', function (e) {
          var _val = this.value.trim();
          if (_val.length < 7) {
            nextBtn.classList.add('ready-btn-undo');
          } else {
            nextBtn.classList.remove('ready-btn-undo');
          }
        });
    }
    if (btnWrap.dataset.form == 6 + designnum) {
      gsap.to(submitBtn, {
        display: 'flex',
        opacity: '1',
      });
      gsap.to(nextBtn, {
        display: 'none',
        opacity: '0',
      });
    }
  }
  if (sectionName == 'members') {
    console.log('dd');
    ++i;

    nextBtn.classList.add('ready-btn-undo');
    if (document.querySelector(`input[name="form${i + 2}"]:checked`)) {
      nextBtn.classList.remove('ready-btn-undo');
    }

    btnWrap.dataset.form = i;

    gsap.to(`#ready-members-section${i + 2}`, 1, {
      x: '-100vw',
      ease: Power3.easeOut,
    });

    if (btnWrap.dataset.form == 0) {
      formChange(i);
    }
    if (btnWrap.dataset.form == 1) {
      document
        .querySelector('input[type="tel"]')
        .addEventListener('keyup', function (e) {
          var _val = this.value.trim();
          if (_val.length < 7) {
            nextBtn.classList.add('ready-btn-undo');
          } else {
            nextBtn.classList.remove('ready-btn-undo');
          }
        });
    }
    if (btnWrap.dataset.form == 2) {
      gsap.to(submitBtn, {
        display: 'flex',
        opacity: '1',
      });
      gsap.to(nextBtn, {
        display: 'none',
        opacity: '0',
      });
    }
  }
});

prevBtn.addEventListener('click', function () {
  var i = btnWrap.dataset.form;
  nextBtn.classList.remove('ready-btn-undo');
  gsap.to(`#ready-${sectionName}-section${order[i]}`, {
    x: '100vw',
  });

  --i;

  btnWrap.dataset.form = i;

  if (btnWrap.dataset.form == 0) {
    gsap.to(prevBtn, {
      visibility: 'hidden',
      opacity: '0',
    });
  }
  if (btnWrap.dataset.form == 6 + designnum) {
    gsap.to(submitBtn, {
      display: 'none',
      opacity: '0',
    });
    gsap.to(nextBtn, {
      display: 'flex',
      opacity: '1',
    });
  }
  formChange(i);
});

document.querySelector('.ready-start').addEventListener('click', function () {
  gsap.to('#ready-contact-section1', {
    x: '-100vw',
  });
  gsap.to('.ready-move-btn-wrap ', {
    display: 'flex',
    opacity: '1',
  });
  btnWrap.dataset.form = 0;
  formChange(0);
});

const fileInput = document.querySelectorAll('input[type="file"]');

fileInput.forEach(function (input) {
  input.addEventListener('change', updateFileName);
});

function updateFileName(e) {
  const curFile = this.files;
  let previewFileName = this.parentNode.querySelector('.add-file-name');
  previewFileName.classList.add('done');
  previewFileName.textContent = curFile[0].name;
}
function autoHypenTel(str) {
  str = str.replace(/[^0-9]/g, '');
  var tmp = '';

  if (str.substring(0, 2) == 02) {
    // 서울 전화번호일 경우 10자리까지만 나타나고 그 이상의 자리수는 자동삭제
    if (str.length < 3) {
      return str;
    } else if (str.length < 6) {
      tmp += str.substr(0, 2);
      tmp += '-';
      tmp += str.substr(2);
      return tmp;
    } else if (str.length < 10) {
      tmp += str.substr(0, 2);
      tmp += '-';
      tmp += str.substr(2, 3);
      tmp += '-';
      tmp += str.substr(5);
      return tmp;
    } else {
      tmp += str.substr(0, 2);
      tmp += '-';
      tmp += str.substr(2, 4);
      tmp += '-';
      tmp += str.substr(6, 4);
      return tmp;
    }
  } else {
    // 핸드폰 및 다른 지역 전화번호 일 경우
    if (str.length < 4) {
      return str;
    } else if (str.length < 7) {
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3);
      return tmp;
    } else if (str.length < 11) {
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 3);
      tmp += '-';
      tmp += str.substr(6);
      return tmp;
    } else {
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 4);
      tmp += '-';
      tmp += str.substr(7);
      return tmp;
    }
  }
  return str;
}
document.querySelectorAll('input[type="tel"]').forEach((el) => {
  el.addEventListener('keyup', function (e) {
    var _val = this.value.trim();
    this.value = autoHypenTel(_val);
    if (_val.length < 7) {
      this.parentNode.classList.add('ready-error');
    } else {
      this.parentNode.classList.remove('ready-error');
    }
  });
});

function verifyEmail(str) {
  // 이메일 검증 스크립트 작성
  var regExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  // 검증에 사용할 정규식 변수 regExp에 저장
  if (str.match(regExp) == null) {
    return 'error';
  }
  return str;
}

document.querySelectorAll('input[type="email"]').forEach((el) => {
  el.addEventListener('focusout', function () {
    var _val = this.value;
    if (verifyEmail(_val) == 'error') {
      this.parentNode.classList.add('ready-error');
    } else {
      this.parentNode.classList.remove('ready-error');
    }
  });
});

var readyTodayDate = new Date();

let readyYear = readyTodayDate.getFullYear();
let readyMonth = readyTodayDate.getMonth() + 1;
let readyDate = readyTodayDate.getDate();

function dateCheck(Date) {
  if (Date <= 10) {
    return '초';
  } else if (Date <= 20) {
    return '중';
  } else {
    return '말';
  }
}

var startYear = document.querySelector('#start-year');
var startMonth = document.querySelector('#start-month');
var startDay = document.querySelector('#start-day');

var endYear = document.querySelector('#end-year');
var endMonth = document.querySelector('#end-month');
var endDay = document.querySelector('#end-day');

var inputEndYear = readyMonth != 12 ? readyYear : readyYear + 1;
var inputEndMonth = readyMonth != 12 ? readyMonth : 01;

startYear.value = readyYear;
startMonth.value = readyMonth;
startDay.value = dateCheck(readyDate);
endYear.value = inputEndYear;
endMonth.value = inputEndMonth;
endDay.value = dateCheck(Date + 10);

startMonth.addEventListener('keyup', function () {
  if (startMonth.value < 1 || startMonth.value > 12) {
    startMonth.value = readyMonth;
  }
});

endMonth.addEventListener('keyup', function () {
  if (endMonth.value < 1 || endMonth.value > 12) {
    endMonth.value = inputEndMonth;
  }
});
startYear.addEventListener('keyup', function () {
  if (startYear.value < readyYear || startYear.value > readyYear + 5) {
    startYear.value = readyYear;
  }
});

endYear.addEventListener('keyup', function () {
  if (
    (endYear.value < readyYear || endYear.value > readyYear + 5) &&
    startYear.value > endMonth.value
  ) {
    endYear.value = inputEndYear;
  }
});

document
  .querySelector('#start-year + .ready-date-btn-wrap .ready-up')
  .addEventListener('click', function () {
    var changeNum = this.parentNode.parentNode.querySelector('#start-year');
    if (changeNum.value < readyYear + 5) {
      ++changeNum.value;
      endYear.value =
        parseInt(changeNum.value) > parseInt(endYear.value)
          ? changeNum.value
          : inputEndYear;
      document
        .querySelector('#start-year + .ready-date-btn-wrap .ready-down')
        .classList.remove('ready-undo');
    } else {
      this.classList.add('ready-undo');
    }
  });
document
  .querySelector('#end-year + .ready-date-btn-wrap .ready-up')
  .addEventListener('click', function () {
    var changeNum = this.parentNode.parentNode.querySelector('#end-year');

    if (changeNum.value < readyYear + 5) {
      ++changeNum.value;
      document
        .querySelector('#end-year + .ready-date-btn-wrap .ready-down')
        .classList.remove('ready-undo');
    } else {
      this.classList.add('ready-undo');
    }
  });

document
  .querySelector('#start-year + .ready-date-btn-wrap .ready-down')
  .addEventListener('click', function () {
    var changeNum = this.parentNode.parentNode.querySelector('#start-year');
    if (changeNum.value > readyYear) {
      --changeNum.value;
      endYear.value =
        parseInt(changeNum.value) > parseInt(endYear.value)
          ? changeNum.value
          : inputEndYear;
      document
        .querySelector('#start-year + .ready-date-btn-wrap .ready-down')
        .classList.remove('ready-undo');
    } else if (changeNum.value == readyYear) {
      this.classList.add('ready-undo');
    }
  });
document
  .querySelector('#end-year + .ready-date-btn-wrap .ready-down')
  .addEventListener('click', function () {
    var changeNum = this.parentNode.parentNode.querySelector('#end-year');
    if (changeNum.value > inputEndYear) {
      --changeNum.value;
      document
        .querySelector('#start-year + .ready-date-btn-wrap .ready-down')
        .classList.remove('ready-undo');
    } else if (changeNum.value == readyYear) {
      this.classList.add('ready-undo');
    }
  });

document
  .querySelector('#end-month + .ready-date-btn-wrap .ready-up')
  .addEventListener('click', function () {
    var changeNum = this.parentNode.parentNode.querySelector('#end-month');
    if (changeNum.value < 12) {
      ++changeNum.value;
      document
        .querySelector('#end-month + .ready-date-btn-wrap .ready-down')
        .classList.remove('ready-undo');
    } else {
      this.classList.add('ready-undo');
    }
  });
document
  .querySelector('#start-month + .ready-date-btn-wrap .ready-up')
  .addEventListener('click', function () {
    var changeNum = this.parentNode.parentNode.querySelector('#start-month');
    if (changeNum.value < 12) {
      ++changeNum.value;
      document
        .querySelector('#start-month + .ready-date-btn-wrap .ready-down')
        .classList.remove('ready-undo');
    } else {
      this.classList.add('ready-undo');
    }
  });
document
  .querySelector('#end-month + .ready-date-btn-wrap .ready-down')
  .addEventListener('click', function () {
    var changeNum = this.parentNode.parentNode.querySelector('#end-month');
    if (changeNum.value > 1) {
      --changeNum.value;
    } else {
      this.classList.add('ready-undo');
    }
  });
document
  .querySelector('#start-month + .ready-date-btn-wrap .ready-down')
  .addEventListener('click', function () {
    var changeNum = this.parentNode.parentNode.querySelector('#start-month');
    if (changeNum.value > 1) {
      --changeNum.value;
    } else {
      this.classList.add('ready-undo');
    }
  });

document
  .querySelector('#end-day + .ready-date-btn-wrap .ready-up')
  .addEventListener('click', function () {
    var changeDate = this.parentNode.parentNode.querySelector('#end-day');
    changeDate.value =
      changeDate.value == '말' ? '초' : changeDate.value == '초' ? '중' : '말';
  });

document
  .querySelector('#start-day + .ready-date-btn-wrap .ready-up')
  .addEventListener('click', function () {
    var changeDate = this.parentNode.parentNode.querySelector('#start-day');
    changeDate.value =
      changeDate.value == '말' ? '초' : changeDate.value == '초' ? '중' : '말';
  });

document
  .querySelector('#end-day + .ready-date-btn-wrap .ready-down')
  .addEventListener('click', function () {
    var changeDate = this.parentNode.parentNode.querySelector('#end-day');
    changeDate.value =
      changeDate.value == '말' ? '중' : changeDate.value == '중' ? '초' : '말';
  });
document
  .querySelector('#start-day + .ready-date-btn-wrap .ready-down')
  .addEventListener('click', function () {
    var changeDate = this.parentNode.parentNode.querySelector('#start-day');
    changeDate.value =
      changeDate.value == '말' ? '중' : changeDate.value == '중' ? '초' : '말';
  });
