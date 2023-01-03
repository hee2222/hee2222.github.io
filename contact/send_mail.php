<?php

$object = $_GET["contact-form1"];
$membersfile = $_FILES['members-file'];
$contactfile = $_FILES['contact-file'];


$to = "heeee018@naver.com";


$boundary = "----" . uniqid("part");

$header = "From:readyfor<$to>\n";
$header .= "MIME-Version: 1.0\r\n";    // MIME 버전 표시

$header .= "Content-Type: Multipart/mixed; boundary = \"$boundary\"";  // 구분자가 $boundary 임을 알려줌
$mailbody .= "This is a multi-part message in MIME format.\r\n\r\n";  // 메세지
$mailbody .= "--$boundary\r\n";              // 내용 구분 시작
$mailbody .= "Content-Type: text/html; charset=\"ks_c_5601-1987\"\r\n";
//암호화 방식을 알려줌
$mailbody .= "Content-Transfer-Encoding: base64\r\n\r\n";

$form2_result = join(", ", $_GET["contact-form2"]);
$form3_result = join(", ", $_GET["contact-form3"]);
$form4_result = join(", ", $_GET["contact-form4"]);


//이메일 내용을 암호화 해서 추가
if ($object == 'member') {
	$title = $_GET["members-info-name"] . '님 멤버 지원';
	$msg = '지원 포지션 : ' . $_GET["members-form2"] . '<br><br>';
	$msg .= '기본 정보 <br>';
	$msg .= '이름 : ' . $_GET["members-info-name"] . '<br>';
	$msg .= '연락처 : ' . $_GET["members-info-tel"] . '<br>';
	$msg .= '이메일 : ' . $_GET["members-info-mail"] . '<br>';
	$msg .= '간단 소개 : ' . $_GET["contact-member-form4"] . '<br>';

	$mailbody .= base64_encode(nl2br($msg)) . "\r\n\r\n";
	// 내용 구분 시작
	if ($membersfile['error'] == 0) {
		if ($membersfile['size'] < (10 * 1024 * 1024)) {
			$mailbody .= "--$boundary\r\n";

			$filename = basename($membersfile['name']);  // 파일명만 추출 후 $filename에 저장
			$fp = fopen($membersfile['tmp_name'], "rw");    // 파일 open
			$file = fread($fp, $membersfile['size']);  // 파일 내용을 읽음
			fclose($fp);          // 파일 close

			//파일 첨부 부분
			$mailbody .= "--$boundary\r\n";
			$mailbody .= "Content-Type:" . $filename['type'] . "; name=\"" . $filename . "\"\r\n";
			$mailbody .= "Content-Transfer-Encoding:base64\r\n";
			$mailbody .= "Content-Disposition: attachment; filename=\"" . $filename . "\"\r\n\r\n";

			base64_encode($file);
			$mailbody .= base64_encode($file);
		}
	}
} else if ($object == 'project') {
	$title = $_GET["contact-info-com"] . ' / ' . $_GET["contact-info-name"] . ' 프로젝트 의뢰';
	$msg = '프로젝트 분류 : ' .  $form2_result . '<br>';
	if (in_array("video", $_GET["contact-form2"])) {
		$msg .= '영상 종류 : ' . $form3_result . '<br>';
	}
	if (in_array("design", $_GET["contact-form2"])) {
		$msg .= '디자인 종류 : ' . $form4_result  . '<br>';
	}

	$msg .= '예상일정 <br>';
	$msg .=  $_GET["start-year"] . '년 ' . $_GET["start-month"] . '월 ' . $_GET["start-day"] . '부터 ' . $_GET["start-year"] . '년 ' . $_GET["start-month"] . '월 ' . $_GET["start-day"] . ' 까지<br>';
	$msg .=  '예산 : ' . $_GET["contact-form6"] . '<br><br>';
	$msg .= '기본 정보 <br>';
	$msg .= '회사명 / 이름 : ' . $_GET["contact-info-com"] . ' / ' . $_GET["contact-info-name"] . '<br>';
	$msg .= '연락처 : ' . $_GET["contact-info-tel"] . '<br>';
	$msg .= '이메일 : ' . $_GET["contact-info-mail"] . ' <br>';
	$msg .= '간단 소개 : ' . $_GET["contact-form8"] . '<br>';

	$mailbody .= base64_encode(nl2br($msg)) . "\r\n\r\n";
	// 내용 구분 시작
	if ($contactfile['error'] == 0) {
		if ($contactfile['size'] < (10 * 1024 * 1024)) {
			$mailbody .= "--$boundary\r\n";

			$filename = basename($contactfile['name']);  // 파일명만 추출 후 $filename에 저장
			$fp = fopen($contactfile['tmp_name'], "rw");    // 파일 open
			$file = fread($fp, $contactfile['size']);  // 파일 내용을 읽음
			fclose($fp);          // 파일 close

			//파일 첨부 부분
			$mailbody .= "--$boundary\r\n";
			$mailbody .= "Content-Type:" . $filename['type'] . "; name=\"" . $filename . "\"\r\n";
			$mailbody .= "Content-Transfer-Encoding:base64\r\n";
			$mailbody .= "Content-Disposition: attachment; filename=\"" . $filename . "\"\r\n\r\n";

			base64_encode($file);
			$mailbody .= base64_encode($file);
		}
	}
}

if (mail($to, $title, $mailbody, $header)) {
	header("Location: ./contact.html#ready-contact-last-section");
	return true;
} else {
	echo '전송 실패!';
	return false;
}
