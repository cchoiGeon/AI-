document.addEventListener('DOMContentLoaded', async () => {
    // 로딩 중... 화면을 보여주고, 컨텐츠를 숨깁니다.
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('content').style.display = 'none';

    try {
        const logincheckResponse = await fetch(`https://asia-northeast3-life-legacy-dev.cloudfunctions.net/api/auth/status`,{
            method: 'GET',
            credentials:'include',
        });
        const result = await logincheckResponse.json();
        if(result.code === "200"){
            const apiResponse = await fetch(`https://asia-northeast3-life-legacy-dev.cloudfunctions.net/api/posts/check/1`,{
                method: 'GET',
                credentials: 'include',
            });
    
            const result = await apiResponse.json();
            if(result.code == "200"){
                window.location.href = "/posts/2";
            }else{
                document.getElementById('loading').style.display = 'none';
                document.getElementById('content').style.display = 'flex';
                const checkJsCompleteEvent = new Event('checkJsComplete');
                document.dispatchEvent(checkJsCompleteEvent);
            }
        }else{
            alert("로그인을 해주세요!");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        loadingElement.textContent = '데이터를 불러오는 중 오류가 발생했습니다.';
    }
});