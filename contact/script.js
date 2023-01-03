document.addEventListener('keydown', function (e) {
  var keycode1 = e.keyCode ? e.keyCode : e.which;
  if (keycode1 == 0 || keycode1 == 9) {
    if (
      e.target == document.querySelector('#members-info-name') ||
      e.target == document.querySelector('#members-info-tel') ||
      e.target == document.querySelector('#contact-info-name') ||
      e.target == document.querySelector('#contact-info-com') ||
      e.target == document.querySelector('#contact-info-tel')
    ) {
      return;
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  }
});
document.addEventListener('keydown', function (e) {
  var keycode1 = e.keyCode ? e.keyCode : e.which;
  if (keycode1 == 13) {
    if (
      e.target == document.querySelector('#contact-form8') ||
      e.target == document.querySelector('#contact-member-form4')
    ) {
      return;
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  }
});

document.querySelectorAll("input[type='file']").forEach((el) => {
  addEventListener('change', function () {
    if (el.value != '') {
      var maxSize = 10 * 1024 * 1024; // 10MB
      const curFile = el.files;
      let previewFileName = el.parentNode.querySelector('.add-file-name');
      if (curFile[0].size > maxSize) {
        alert('첨부파일 사이즈는 10MB 이내로 등록 가능합니다.');
        el.value = '';
        previewFileName.textContent = '파일첨부';
        previewFileName.classList.remove('done');
        return false;
      } else {
        previewFileName.textContent = curFile[0].name;
        previewFileName.classList.add('done');
      }
    }
  });
});
var animations = document.querySelectorAll('.gsap-up');
gsap.to(animations, {
  delay: 0.3,
  opacity: '1',
  y: 0,
  ease: Power3.easeOut,
  duration: 1.2,
  stagger: 0.5,
});

let btnWrap = document.querySelector('.ready-move-btn-wrap');
let nextBtn = document.querySelector('.ready-move-btn-wrap .ready-next-black');
let prevBtn = document.querySelector('.ready-move-btn-wrap .ready-prev-black');
let submitBtn = document.querySelector(
  '.ready-move-btn-wrap .ready-next-red.submit-btn'
);
var readyTodayDate = new Date();

var startYear = document.querySelector('#start-year');
var startMonth = document.querySelector('#start-month');
var startDay = document.querySelector('#start-day');

var endYear = document.querySelector('#end-year');
var endMonth = document.querySelector('#end-month');
var endDay = document.querySelector('#end-day');

let readyYear = readyTodayDate.getFullYear();
let readyMonth = readyTodayDate.getMonth() + 1;
let readyDate = readyTodayDate.getDate();

function formChange(i, section) {
  var formWrap = document.querySelectorAll(
    `input[name^="${section}-form${i}"]`
  );
  formWrap.forEach(function (el) {
    el.addEventListener('change', function () {
      if (
        document.querySelector(`input[name^="${section}-form${i}"]:checked`)
      ) {
        nextBtn.classList.remove('ready-btn-undo');
      } else {
        nextBtn.classList.add('ready-btn-undo');
      }
    });
  });
}

function formCheck(section) {
  if (
    document.querySelector(`input[id="${section}-info-mail"]`).value &&
    document.querySelector(`input[id="${section}-info-tel"]`).value &&
    !document
      .querySelector(`input[id="${section}-info-tel"]`)
      .parentNode.classList.contains('ready-error') &&
    !document
      .querySelector(`input[id="${section}-info-mail"]`)
      .parentNode.classList.contains('ready-error')
  ) {
    if (
      section == 'contact' &&
      (document.querySelector(`input[id="${section}-info-name"]`).value ||
        document.querySelector(`input[id="${section}-info-name"]`).value)
    ) {
      nextBtn.classList.remove('ready-btn-undo');
    } else if (
      section == 'members' &&
      document.querySelector(`input[id="${section}-info-name"]`).value
    ) {
      nextBtn.classList.remove('ready-btn-undo');
    }
  } else {
    nextBtn.classList.add('ready-btn-undo');
  }
}

let sectionName = 'contact';
let sectionNum = 1;

var form2 = [];

nextBtn.addEventListener('click', function () {
  nextBtn.classList.add('ready-btn-undo');
  sectionNum = btnWrap.dataset.form;

  if (sectionNum == 1) {
    gsap.to(prevBtn, {
      visibility: 'visible',
      opacity: '1',
    });
    sectionName =
      document.querySelector(`input[name="contact-form1"]:checked`).value ==
      'member'
        ? 'members'
        : 'contact';
  }
  if (sectionName == 'contact') {
    form2 = document.querySelectorAll(`input[name^="contact-form2"]:checked`);
    form2 = [...form2].map((el) => el.value);
    if (sectionNum == 2) {
      if (form2[0] == 'design' && form2.length == 1) {
        sectionNum = 3;
      }
    }

    if (sectionNum == 3 && form2[0] == 'video' && form2.length == 1) {
      sectionNum = 4;
    }
    if (sectionNum == 4) {
      nextBtn.classList.remove('ready-btn-undo');

      document
        .querySelectorAll(
          '.ready-date-btn-wrap .ready-up, .ready-date-btn-wrap .ready-down'
        )
        .forEach((el) => {
          el.addEventListener('click', function () {
            var clickEndDay = new Date(
              endYear.value,
              parseInt(endMonth.value) - 1,
              endDay.value == '초' ? '10' : endDay.value == '중' ? '20' : '28'
            );
            var clickStartDay = new Date(
              startYear.value,
              parseInt(startMonth.value) - 1,
              startDay.value == '초'
                ? '10'
                : startDay.value == '중'
                ? '20'
                : '28'
            );
            if (clickEndDay - clickStartDay > 0) {
              nextBtn.classList.remove('ready-btn-undo');
            } else {
              nextBtn.classList.add('ready-btn-undo');
            }
          });
        });
    }
    if (sectionNum == 6) {
      formCheck('contact');
      document
        .querySelectorAll('#ready-contact-section7 input')
        .forEach((el) => {
          el.addEventListener('keyup', function () {
            formCheck('contact');
          });
        });
    }
    if (sectionNum == 7) {
      gsap.to(nextBtn, {
        display: 'none',
        opacity: '0',
        duration: 0.1,
      });
      gsap.to(submitBtn, {
        display: 'flex',
        opacity: '1',
        duration: 0.1,
        delay: 0.2,
      });
    }
  } else if (sectionName == 'members') {
    if (sectionNum == 2) {
      formCheck('members');
      document
        .querySelectorAll('#ready-members-section3 input')
        .forEach((el) => {
          el.addEventListener('keyup', function () {
            formCheck('members');
          });
        });
    }
    if (sectionNum == 3) {
      gsap.to(nextBtn, {
        display: 'none',
        opacity: '0',
        duration: 0.1,
      });
      gsap.to(submitBtn, {
        display: 'flex',
        opacity: '1',
        duration: 0.1,
        delay: 0.2,
      });
    }
  }

  sectionNum++;

  gsap.to(`#ready-${sectionName}-section${sectionNum}`, {
    x: '-100vw',
  });

  if (sectionNum == 1) {
    formChange(sectionNum, 'contact');
  }
  if (sectionNum == 2) {
    formChange(sectionNum, sectionName);
  }
  if (sectionName == 'contact') {
    if (sectionNum == 3 || sectionNum == 4 || sectionNum == 6) {
      formChange(sectionNum, 'contact');
    }
  }

  if (
    document.querySelector(
      `input[name^="${sectionName}-form${sectionNum}"]:checked`
    )
  ) {
    nextBtn.classList.remove('ready-btn-undo');
  }

  btnWrap.dataset.form = sectionNum;
});

prevBtn.addEventListener('click', function () {
  sectionNum = btnWrap.dataset.form;
  nextBtn.classList.remove('ready-btn-undo');

  if (sectionName == 'contact') {
    form2 = document.querySelectorAll(`input[name^="contact-form2"]:checked`);
    form2 = [...form2].map((el) => el.value);

    if (sectionNum == 5) {
      gsap.to(`#ready-contact-section5`, {
        x: '100vw',
      });

      if (form2.length == 1 && form2[0] == 'video') {
        sectionNum = 4;
      }
    }
    if (sectionNum == 4 && form2[0] == 'design' && form2.length == 1) {
      sectionNum = 3;
      gsap.to(`#ready-contact-section4`, {
        x: '100vw',
      });
    }

    if (sectionNum == 8) {
      gsap.to(submitBtn, {
        display: 'none',
        opacity: '0',
        duration: 0.1,
      });
      gsap.to(nextBtn, {
        display: 'flex',
        opacity: '1',
        duration: 0.1,
        delay: 0.2,
      });
    }
  } else if (sectionName == 'members') {
    if (sectionNum == 4) {
      gsap.to(submitBtn, {
        display: 'none',
        opacity: '0',
        duration: 0.1,
      });
      gsap.to(nextBtn, {
        display: 'flex',
        opacity: '1',
        duration: 0.1,
        delay: 0.2,
      });
    }
  }

  gsap.to(`#ready-${sectionName}-section${sectionNum}`, {
    x: '100vw',
  });

  --sectionNum;

  formChange(sectionNum, sectionName);

  if (sectionNum == 1) {
    gsap.to(prevBtn, {
      visibility: 'hidden',
      opacity: '0',
    });
  }
  if (sectionNum == 6) {
    gsap.to(submitBtn, {
      display: 'none',
      opacity: '0',
    });
    gsap.to(nextBtn, {
      display: 'flex',
      opacity: '1',
    });
  }

  btnWrap.dataset.form = sectionNum;
});

document.querySelector('.ready-start').addEventListener('click', function () {
  var tl = gsap.timeline({});
  tl.to('#ready-contact-section1', {
    display: 'flex',
    opacity: 1,
    duration: 0.3,
  });
  tl.to(
    '.ready-move-btn-wrap ',
    {
      display: 'flex',
      opacity: '1',
    },
    '>'
  );
  btnWrap.dataset.form = 1;
  formChange(1, 'contact');
});

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
  el.addEventListener('keypress', function (e) {
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
  var regExp = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );
  // 검증에 사용할 정규식 변수 regExp에 저장
  if (str.match(regExp) == null) {
    return 'error';
  }
  return str;
}

document.querySelectorAll('input[type="email"]').forEach((el) => {
  el.addEventListener('keypress', function () {
    var _val = this.value;
    if (verifyEmail(_val) == 'error') {
      this.parentNode.classList.add('ready-error');
    } else {
      this.parentNode.classList.remove('ready-error');
    }
  });
});

function dateCheck(Date) {
  if (Date <= 10) {
    return '초';
  } else if (Date <= 20) {
    return '중';
  } else {
    return '말';
  }
}

var inputEndYear = readyMonth != 12 ? readyYear : readyYear + 1;
var inputEndMonth = readyMonth != 12 ? readyMonth : 01;

startYear.value = readyYear;
startMonth.value = readyMonth;
startDay.value = dateCheck(readyDate);
endYear.value = inputEndYear;
endMonth.value = inputEndMonth;
endDay.value = dateCheck(Date + 10);

document.querySelectorAll('.ready-date-btn-wrap .ready-up').forEach((el) => {
  el.addEventListener('click', function () {
    var changeInput = el.parentNode.parentNode.querySelector('input');

    if (changeInput.id == 'start-year' || changeInput.id == 'end-year') {
      if (changeInput.value < readyYear + 5) {
        changeInput.value++;
        if (changeInput.id == 'start-year') {
          endYear.value =
            parseInt(changeInput.value) > parseInt(endYear.value)
              ? changeInput.value
              : endYear.value;
          document
            .querySelector(`#end-year + .ready-date-btn-wrap .ready-down`)
            .classList.remove('ready-undo');
        }
        document
          .querySelector(
            `#${changeInput.id} + .ready-date-btn-wrap .ready-down`
          )
          .classList.remove('ready-undo');

        if (changeInput.value == readyYear + 5) {
          el.classList.add('ready-undo');
          document
            .querySelector(`#end-year + .ready-date-btn-wrap .ready-up`)
            .classList.add('ready-undo');
        }
      }
    } else if (
      changeInput.id == 'start-month' ||
      changeInput.id == 'end-month'
    ) {
      if (changeInput.value < 12) {
        changeInput.value++;
      } else {
        changeInput.value = 1;
      }
    } else {
      changeInput.value =
        changeInput.value == '말'
          ? '초'
          : changeInput.value == '초'
          ? '중'
          : '말';
    }
  });
});

document.querySelectorAll('.ready-date-btn-wrap .ready-down').forEach((el) => {
  el.addEventListener('click', function () {
    var changeInput = el.parentNode.parentNode.querySelector('input');

    if (changeInput.id == 'start-year' || changeInput.id == 'end-year') {
      if (changeInput.value > readyYear) {
        changeInput.value--;
        if (startYear.value >= endYear.value) {
          startYear.value = endYear.value;
          document
            .querySelector(`#end-year + .ready-date-btn-wrap .ready-down`)
            .classList.add('ready-undo');
        } else {
          document
            .querySelector(`#end-year + .ready-date-btn-wrap .ready-down`)
            .classList.remove('ready-undo');
        }
        if (changeInput.value == readyYear) {
          el.classList.add('ready-undo');
        }
        document
          .querySelector(`#${changeInput.id} + .ready-date-btn-wrap .ready-up`)
          .classList.remove('ready-undo');
      }
    } else if (
      changeInput.id == 'start-month' ||
      changeInput.id == 'end-month'
    ) {
      if (changeInput.value > 1) {
        changeInput.value--;
      } else {
        changeInput.value = 12;
      }
    } else {
      changeInput.value =
        changeInput.value == '말'
          ? '중'
          : changeInput.value == '중'
          ? '초'
          : '말';
    }
  });
});
