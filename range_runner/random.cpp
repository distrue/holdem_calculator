#include <queue>
using namespace std;

#define ALL_CARD_NUM 52

// [S]pade [H]eart [D]ia [C]lub
// 13으로 나눈 몫    -> 각각 1 / 2 / 3 / 4 (0~12 / 13~25 / 26~38 / 39~51)
// 13으로 나눈 나머지 -> 2~10(0~8), J(9), Q(10), K(11), A(12)

int output_card_num[52]; // for 분포 체크 (random 제대로 작동하는지)
int player_num, N, M, count;
bool input_card[52]; // for dead card counting
queue<int> output;
int shared_card[5];
bool check_card[52]; // 매번 초기화 필요

bool player_range[12][169]; // front page 로부터 입력
int player_range_num[12]; // player range 수
bool player_check[12]; // 매번 초기화 필요, 해당 게임에서 이 플레이어가 참가했는지 확인(패가 range 안에 있는 경우)
int player_win[12]; // player 가 이긴 게임 수

void clear_queue(queue<int> &q){
    queue<int> empty;
    swap(q, empty);
}

void init_game(){
    srand((unsigned int)time(0));
    clear_queue(output);
    memset(input_card, true, sizeof(input_card));
    memset(shared_card, 0, sizeof(shared_card));
    memset(output_card_num, 0, sizeof(output_card_num));
    memset(player_win, 0, sizeof(player_win));
    memset(player_play, 0, sizeof(player_play));
}

void input_cards(){
    printf("Input Player number / N(dead card number) / M(shared card number).\n");
    scanf("%d%d%d", &N, &M, &player_num);
    printf("Input N dead cards..\n");
    for(int i = 0; i < N; i++){
        int x; scanf("%d", &x);
        input_card[x] = false;
    }
    printf("Input M shared cards..\n");
    for(int i = 0; i < M; i++){
        int x; scanf("%d", &x);
        shared_card[i] = x;
        input_card[x] = false; // shared card not counted in hand combo
    }
    for(int i = 0; i < player_num; i++){
        printf("Input player %d range..\n");
        for(int j = 0; j < player_range_num[i]; j++){
            int x; scanf("%d", &x);
            player_range[i][x] = true;
        }
    }
}

// random 한 정수 (1~52, shared & dead 제외)((5-M) + player_num * 2)
void Monte_Carlo(){
    // 5-M 개의 공유 카드, 각 플레이어가 받는 2장의 카드
    int num = 5 - M + player_num * 2;
    for(int i = 0; i < num; i++){
        int now = rand() % 52;

        // 이미 나온 번호거나 dead card 인 경우 세지 않음
        if(input_card[now] == false || check_card[now] == true){
            i--; continue;
        }
        check_card[now] = true;
        output.push(now);
        output_card_num[now]++;
    }
}

bool check_straight(int * num){
    int diff1 = num[1] - num[0];
    int diff2 = num[2] - num[1];
    int diff3 = num[3] - num[2];
    int diff4 = num[4] - num[3];

    if(diff1 == diff2 == diff3 == diff4 == 1) return true; // 일반적인 경우
    // 2(0) 3(1) 4(2) 5(3) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 2 && num[3] == 3 && num[4] == 12) return true;
    // 2(0) 3(1) 4(2) K(11) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 2 && num[3] == 11 && num[4] == 12) return true;
    // 2(0) 3(1) Q(10) K(11) A(12)
    if(num[0] == 0 && num[1] == 1 && num[2] == 10 && num[3] == 11 && num[4] == 12) return true;
    // 2(0) J(9) Q(10) K(11) A(12)
    if(num[0] == 0 && num[1] == 9 && num[2] == 10 && num[3] == 11 && num[4] == 12) return true;

    return false;
}

int thirteen_multi(int n){ // 13^n 반환
    int x = 1;
    while(n--){
        x *= 13;
    }
    return x;
}

// 5장으로 만들 수 있는 조합 만드는 함수
// 패 강함에 따라 숫자 부여, 대소관계로 패 비교
// 스트레이트 플러시 > 포카드 > 풀하우스 > 플러시 > 스트레이트 > 트리플 > 투 페어 > 원 페어 > 탑
int made(int * hand){
    int result = 0;
    int num[5], pattern[5];
    for(int i = 0; i < 5; i++) pattern[i] = hand[i] / 13;
    for(int i = 0; i < 5; i++){
        num[i] = hand[i] % 13;
        num[i]++; // zero -> one for caculating normally
    }
    sort(num, num+5); sort(pattern, pattern+5);
    int mul1 = thirteen_multi(1); // 13^1
    int mul2 = thirteen_multi(2); // 13^2
    int mul3 = thirteen_multi(3); // 13^3
    int mul4 = thirteen_multi(4); // 13^4
    int mul5 = thirteen_multi(5); // 13^5

    if(pattern[0] == pattern[1] == pattern[2] == pattern[3] == pattern[4]){
        // 스트레이트 플러시
        if(check_straight(num)){
            result  = 100000000;
            result += num[4];
        }
        // 플러시
        else{
            result  = 100000;
            result += num[4]*mul4 + num[3]*mul3 + num[2]*mul2 + num[1]*mul1 + num[0];
        }
    }
    else{ // 플러시 제외
        // 포카드
        if(num[0] == num[1] == num[2] == num[3] || num[0] == num[1] == num[2] == num[4] || num[0] == num[1] == num[3] == num[4] || num[0] == num[2] == num[3] == num[4] || num[1] == num[2] == num[3] == num[4]){
            result  = 10000000;
            if(num[0] == num[1] == num[2] == num[3]) result += num[3] * 10000 + num[4];
            else if(num[0] == num[1] == num[2] == num[4]) result += num[4] * 10000 + num[3];
            else if(num[0] == num[1] == num[3] == num[4]) result += num[4] * 10000 + num[2];
            else if(num[0] == num[2] == num[3] == num[4]) result += num[4] * 10000 + num[1];
            else result += num[4] * 10000 + num[0];
            
        }
        // 풀하우스
        else if(num[0] == num[2] && num[3] == num[4] || num[2] == num[4] && num[0] == num[1]){
            result  = 1000000;
            if(num[0] == num[2]) result += num[0] * 100 + num[4];
            else result += num[0] + num[4] * 100;
        }
        // 스트레이트
        else if(check_straight(num)){
            result  = 10000;
            result += num[4];
        }
        // 트리플
        else if(num[0] == num[2] || num[1] == num[3] || num[2] == num[4]){
            result  = 1000;
            result += num[2] * mul2; // 3개가 같으면 반드시 num[2] 에 속함
            if(num[0] == num[2]) result += num[4] * mul1 + num[3];
            else if(num[1] == num[3]) result += num[4] * mul1 + num[0];
            else result += num[1] * mul1 + num[0];
        }
        // 투 페어 -> 음수에서 따짐
        else if(num[0] == num[1] && num[2] == num[3] || num[0] == num[1] && num[3] == num[4] || num[1] == num[2] && num[3] == num[4]){
            result  = -10000;
            if(num[0] == num[1] && num[2] == num[3]) result += num[3] * mul2 + num[1] * mul2 + num[4];
            else if(num[0] == num[1] && num[3] == num[4]) result += num[4] * mul2 + num[1] * mul2 + num[2];   
            else result += num[4] * mul2 + num[2] * mul2 + num[0];
        }
        // 원 페어 -> 음수에서 따짐
        else if(num[0] == num[1] || num[1] == num[2] || num[2] == num[3] || num[3] == num[4]){
            result  = -100000;
            if(num[0] == num[1]) result += num[1] * mul3 + num[4] * mul2 + num[3] * mul1 + num[2];
            else if(num[1] == num[2]) result += num[2] * mul3 + num[4] * mul2 + num[3] * mul1 + num[0];
            else if(num[2] == num[3]) result += num[3] * mul3 + num[4] * mul2 + num[1] * mul1 + num[0];
            else result += num[4] * mul3 + num[2] * mul2 + num[1] * mul1 + num[0];
        }
        // 탑 -> 음수에서 따짐
        else{
            result  = -1000000;
            result += num[4] * mul4 + num[3] * mul3 + num[2] * mul2 + num[1] * mul1 + num[0];
        }
    }
    return result;
}

// 7장으로 만들 수 있는 가장 높은 패 확인
int check_hand(int player_hand[]){
    int result = 0; // result <- 패가 강할수록 숫자가 크도록 구현해야 함
    int now_hand[5];
    for(int not1 = 0; not1 < 7; not1++){
        for(int not2 = not1 + 1; not2 < 7; not2++){
            int cnt = 0;
            for(int i = 0; i < 7; i++){
                if(i == not1 || i == not2) continue;
                now_hand[cnt++] = player_hand[i];
            }
            int now_result = made(now_hand);
            if(now_result > result) result = now_result;
        }
    }
    return result;
}

void percentage_calculate(int trying_num){
    double win_percent[12];
    for(int i = 0; i < player_num; i++){
        win_percent[i] = (double)player_win[i] / trying_num;
    }
    for(int i = 0; i < player_num; i++) printf("%d ", player_win[i]);
    puts("");

/*
// for result test
    for(int i = 0; i < player_num; i++){
        printf("%.2f%%  ", win_percent[i] * 100);
    }
    puts("");
*/

}

int main()
{
    printf("\n\n\tPoker Game\n\n");
    init_game();
    input_cards();
    // input_player_range(); -> needed

    printf("counting...\n\n");
    int trying_num = 0;
    while(1){
        trying_num++;
        memset(check_card, false, sizeof(check_card));
        clear_queue(output);

        Monte_Carlo();
/* 
// for test => Monte_Carlo function works well
        while(!output.empty()){
            cout << output.front() << " ";
            output.pop();
        }
        cout << endl;
*/

        // 5 shared cards (if M == 3, 2 cards selected randomly)
        for(int j = M; j < 5; j++){
            shared_card[j] = output.front();
            output.pop();
        }
        
        // N players (max 12)
        int player_card[12][2];
        int player_result[12];

        for(int j = 0; j < player_num; j++){
            for(int k = 0; k < 2; k++){
                player_card[j][k] = output.front();
                output.pop();
            }
            int player_hand[7];
            for(int k = 0; k < 5; k++) player_hand[k] = shared_card[k];
            for(int k = 5; k < 7; k++) player_hand[k] = player_card[j][k-5];
            sort(player_hand, player_hand+7);
            player_result[j] = check_hand(player_hand);
        }

        queue<int> highest_user; // 가장 높은 패 들고 있는 사람
        int highest = 0; highest_user.push(highest); // 시작할 땐 당연히 player 0이 최고 패

        for(int j = 1; j < player_num; j++){
            if(player_result[j] > player_result[highest]){ // 최고 패 변경 발생
                highest = j;
                clear_queue(highest_user);
                highest_user.push(j);
            }
            else if(player_result[j] == player_result[highest]){ // 패 순위 동일
                highest_user.push(j); // 그냥 추가
            }
            else continue;
        }

// ? -> 최고 패가 2명 이상인 경우 비겼다고 처리하는지 아니면 그냥 둘 다 이겼다고 처리하는지..
        while(!highest_user.empty()){
            player_win[highest_user.front()]++;
            highest_user.pop();
        }
        percentage_calculate(trying_num);
    }
    return 0;
}