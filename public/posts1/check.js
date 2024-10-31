document.addEventListener('DOMContentLoaded', async () => {
    // 로딩 중 화면을 보여주고, 컨텐츠를 숨깁니다.
    const loadingElement = document.getElementById('loading');
    const contentElement = document.getElementById('content');
    
    loadingElement.style.display = 'flex';
    contentElement.style.display = 'none';

    try {
        const logincheckResponse = await fetch(`https://asia-northeast3-life-legacy-dev.cloudfunctions.net/api/auth/status`, {
            method: 'GET',
            credentials: 'include',
        });
        const loginCheckResult = await logincheckResponse.json(); // 중복 방지 위해 변수명 수정

        if (loginCheckResult.code === "200") {
            const apiResponse = await fetch(`https://asia-northeast3-life-legacy-dev.cloudfunctions.net/api/posts/check/1`, {
                method: 'GET',
                credentials: 'include',
            });
    
            const apiResult = await apiResponse.json(); // 변수명 중복 방지
            console.log(apiResult);

            if (apiResult.code == "200") {
                window.location.href = "/posts/2";
            } else {
                loadingElement.style.display = 'none';
                contentElement.style.display = 'flex';
                
                const checkJsCompleteEvent = new Event('checkJsComplete');
                document.dispatchEvent(checkJsCompleteEvent);
            }
        } else {
            alert("로그인을 해주세요!");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
});
