document.addEventListener('DOMContentLoaded', async () => {
    // 로딩 중... 화면을 보여주고, 컨텐츠를 숨깁니다.
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('content').style.display = 'none';
    try {
        const logincheckResponse = await fetch(`https://asia-northeast3-life-legacy-dev.cloudfunctions.net/api/auth/status`,{
            method: 'GET',
            credentials:'include',
        });
        const logincheckResult = await logincheckResponse.json();
        if(logincheckResult.code != '200'){
            alert("로그인을 해주세요");
            window.location.href = "/login";
        }

        const existMyprofileResponse = await fetch(`https://asia-northeast3-life-legacy-dev.cloudfunctions.net/api/profile/me/main-question`,{
            method: 'GET',
            credentials: 'include',
        });

        const isExistMPData = await existMyprofileResponse.json();
        if(isExistMPData.code === "200"){ // 있는 경우
            window.location.href = "/posts/1";
        }else{ // 없는 경우
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').style.display = 'flex';
            // check.js 완료 이벤트 발생
            const checkJsCompleteEvent = new Event('checkJsComplete');
            document.dispatchEvent(checkJsCompleteEvent);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
});