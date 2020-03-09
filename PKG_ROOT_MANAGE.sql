CREATE OR REPLACE PACKAGE TESTUSER.PKG_ROOT_MANAGE IS

    /******************************************************************************
    NAME        : SI_ROOT
    DESCRIPTION : MERGE ROOT
    
    REVISIONS:
    Ver     Date        CR No.         Author         Description
    ------------------------------------------------------------------------------
    1.0     2015-03-26                 Kim, Hyungjin    Created
    ******************************************************************************/
    PROCEDURE SI_ROOT (
        IN_USER_ID                IN  VARCHAR2,
        IN_SEQ_CODE               IN  VARCHAR2,
        IN_ROOT_NAME              IN  VARCHAR2,
        IN_START_DATE             IN  VARCHAR2,
        IN_MEMBER_CNT             IN  NUMBER,
        IN_STATUS                 IN  VARCHAR2,
        IN_PREPARE_LIST           IN  CLOB,
        IN_DAYITEM_LIST           IN  CLOB,
        IN_DAYITEMPATH_LIST       IN  CLOB,
        IN_CREATE_USER_ID         IN  VARCHAR2,
        IN_SCORE                  IN  NUMBER,
        OUT_SEQ_CD                OUT VARCHAR2,
        OUT_SCORE                 OUT NUMBER,
        OUT_ERR_CD                OUT VARCHAR2,
        OUT_ERR_MSG               OUT VARCHAR2
    );

    /******************************************************************************
    NAME        : SS_ROOT_LIST
    DESCRIPTION : SELECT ROOT LIST
    
    REVISIONS:
    Ver     Date        CR No.         Author         Description
    ------------------------------------------------------------------------------
    1.0     2015-03-26                 Kim, Hyungjin    Created
    ******************************************************************************/
    PROCEDURE SS_ROOT_LIST (
        IN_GUBUN                  IN  VARCHAR2,
        IN_TEXT                   IN  VARCHAR2,
        IN_ONLY_MYSELF            IN  VARCHAR2,
        IN_NEW_EXIST              IN  VARCHAR2,
        IN_USER_ID                IN  VARCHAR2,
        IN_PAGE_NO                IN  NUMBER,
        IN_PAGE_SIZE              IN  NUMBER,
        OUT_ERR_CD                OUT VARCHAR2,
        OUT_ERR_MSG               OUT VARCHAR2,
        OUT_TOTAL_COUNT           OUT NUMBER,
        OUT_DATA                  OUT PKG_COMMON.OUT_TABLE
    );
    
    /******************************************************************************
    NAME        : SS_ROOT_DETAIL
    DESCRIPTION : SELECT ROOT LIST
    
    REVISIONS:
    Ver     Date        CR No.         Author         Description
    ------------------------------------------------------------------------------
    1.0     2015-03-26                 Kim, Hyungjin    Created
    ******************************************************************************/
    PROCEDURE SS_ROOT_DETAIL (
        IN_REQ_USER_ID            IN  VARCHAR2,
        IN_REQ_SEQ_CODE           IN  VARCHAR2,
        IN_USER_ID                IN  VARCHAR2,
        IN_SCORE                  IN  NUMBER,
        OUT_ERR_CD                OUT VARCHAR2,
        OUT_ERR_MSG               OUT VARCHAR2,
        OUT_DATA                  OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_PRE              OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_DAY              OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_DPATH            OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_REPBOARD        OUT PKG_COMMON.OUT_TABLE
    );

    /******************************************************************************
    NAME        : SS_ROOT_COMBO_FORMODIFY
    DESCRIPTION : SELECT ROOT LIST
    
    REVISIONS:
    Ver     Date        CR No.         Author         Description
    ------------------------------------------------------------------------------
    1.0     2015-03-26                 Kim, Hyungjin    Created
    ******************************************************************************/
    PROCEDURE SS_ROOT_COMBO_FORMODIFY (
        IN_USER_ID                IN  VARCHAR2,
        IN_SEQ_CODE               IN  VARCHAR2,
        OUT_ERR_CD                OUT VARCHAR2,
        OUT_ERR_MSG               OUT VARCHAR2,
        OUT_DATA_NATION           OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_CITY             OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_SEEINFO          OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_FOODINFO         OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_STAYINFO         OUT PKG_COMMON.OUT_TABLE
    );

   /******************************************************************************
    NAME        : SS_ROOT_LIST_COMBO
    DESCRIPTION : SELECT ROOT LIST for COMBOBOX
    
    REVISIONS:
    Ver     Date        CR No.         Author         Description
    ------------------------------------------------------------------------------
    1.0     2015-03-26                 Kim, Hyungjin    Created
    ******************************************************************************/
    PROCEDURE SS_ROOT_LIST_COMBO (
        IN_USER_ID                IN  VARCHAR2,
        OUT_ERR_CD                OUT VARCHAR2,
        OUT_ERR_MSG               OUT VARCHAR2,
        OUT_DATA                  OUT PKG_COMMON.OUT_TABLE
    );
        
END PKG_ROOT_MANAGE;
/

CREATE OR REPLACE PACKAGE BODY TESTUSER.PKG_ROOT_MANAGE IS

    PROCEDURE SI_ROOT (
        IN_USER_ID                IN  VARCHAR2,
        IN_SEQ_CODE               IN  VARCHAR2,
        IN_ROOT_NAME              IN  VARCHAR2,
        IN_START_DATE             IN  VARCHAR2,
        IN_MEMBER_CNT             IN  NUMBER,
        IN_STATUS                 IN  VARCHAR2,
        IN_PREPARE_LIST           IN  CLOB,
        IN_DAYITEM_LIST           IN  CLOB,
        IN_DAYITEMPATH_LIST       IN  CLOB,
        IN_CREATE_USER_ID         IN  VARCHAR2,
        IN_SCORE                  IN  NUMBER,
        OUT_SEQ_CD                OUT VARCHAR2,
        OUT_SCORE                 OUT NUMBER,
        OUT_ERR_CD                OUT VARCHAR2,
        OUT_ERR_MSG               OUT VARCHAR2
    ) IS
        
        V_SEQ_CD                  MTS_ROOT_MST.SEQ_CD%TYPE := NULL;
        V_STATUS                  MTS_ROOT_MST.STATUS%TYPE := NULL;
        V_PREPARE_SEQ             NUMBER := 1;
        V_DAY_SEQ                 NUMBER := 1;
        V_OLD_DAY_SEQ             NUMBER := 1;
        V_PATH_SEQ                NUMBER := 1;
        V_ROW_TOKENIZER           CLOB_TOKENIZER;
        V_COL_TOKENIZER           CLOB_TOKENIZER;
        V_ROWS                    VARCHAR2(4000);
        V_ITEM_NAME               MTS_ROOT_PREPARE.ITEM_NAME%TYPE := NULL;
        V_ITEM_AMT                MTS_ROOT_PREPARE.ITEM_AMT%TYPE := NULL;
        V_ITEM_CURRENCY           MTS_ROOT_PREPARE.ITEM_CURRENCY%TYPE := NULL;
        V_STAY_AREA_CD            MTS_ROOT_DAY_MST.STAY_AREA_CD%TYPE := NULL;
        V_STAY_NATION_CD          MTS_ROOT_DAY_MST.STAY_NATION_CD%TYPE := NULL;
        V_STAY_CITY_CD            MTS_ROOT_DAY_MST.STAY_CITY_CD%TYPE := NULL;
        V_STAY_SEQ_CD             MTS_ROOT_DAY_MST.STAY_SEQ_CD%TYPE := NULL;
        V_STAY_AMT                MTS_ROOT_DAY_MST.STAY_AMT%TYPE := NULL;
        V_STAY_AMT_CUR            MTS_ROOT_DAY_MST.STAY_AMT_CURRENCY%TYPE := NULL;
        V_SEE_GUBUN               MTS_ROOT_DAY_PATH.SEE_GUBUN%TYPE := NULL;
        V_ADDPAY_NAME             MTS_ROOT_DAY_MST.ADDPAY_NAME%TYPE := NULL;
        V_ADDPAY_AMT              MTS_ROOT_DAY_MST.ADDPAY_AMT%TYPE := NULL;
        V_ADDPAY_AMT_CUR          MTS_ROOT_DAY_MST.ADDPAY_AMT_CURRENCY%TYPE := NULL;
        V_MOVE_GB                 MTS_ROOT_DAY_MST.MOVE_GB%TYPE := NULL;
        V_MOVE_DIST               MTS_ROOT_DAY_MST.MOVE_DIST%TYPE := NULL;
        V_MOVE_DIST_GB            MTS_ROOT_DAY_MST.MOVE_DIST_GB%TYPE := NULL;
        V_MOVE_HOUR               MTS_ROOT_DAY_MST.MOVE_HOUR%TYPE := NULL;
        V_MOVE_MIN                MTS_ROOT_DAY_MST.MOVE_MIN%TYPE := NULL;
        V_MOVE_AMT                MTS_ROOT_DAY_MST.MOVE_AMT%TYPE := NULL;
        V_MOVE_AMT_CUR            MTS_ROOT_DAY_MST.MOVE_AMT_CURRENCY%TYPE := NULL;
        V_PATH_HOUR               MTS_ROOT_DAY_PATH.PATH_HOUR%TYPE := NULL;
        V_PATH_MIN                MTS_ROOT_DAY_PATH.PATH_HOUR%TYPE := NULL;
        
    BEGIN

        IF IN_SEQ_CODE IS NOT NULL THEN
            V_SEQ_CD := IN_SEQ_CODE;    
        ELSE
            SELECT 
                CASE WHEN MAX(SEQ_CD) IS NULL THEN '0000000001'
                ELSE LPAD(MAX(SEQ_CD)+1,10,'0') END  INTO V_SEQ_CD
            FROM MTS_ROOT_MST WHERE UPPER(USERID) = UPPER(IN_USER_ID);
        END IF;

        SELECT
            CASE WHEN MAX(STATUS) IS NULL THEN 'Y' ELSE MAX(STATUS) END INTO V_STATUS
        FROM
            MTS_ROOT_MST
        WHERE
            UPPER(USERID)=UPPER(IN_USER_ID) AND SEQ_CD=V_SEQ_CD;

        IF V_STATUS IN ('Y','T') AND IN_STATUS='S' THEN
            PKG_COMMON.SI_USERLEVEL_ADD(IN_USER_ID, IN_SCORE);
            OUT_SCORE := IN_SCORE;
        ELSE
            OUT_SCORE := 0;
        END IF;

        MERGE INTO
            MTS_ROOT_MST A
        USING
            (SELECT IN_USER_ID AS USERID, IN_SEQ_CODE AS SEQ_CD FROM DUAL) B
        ON
            (UPPER(A.USERID) = UPPER(B.USERID) AND A.SEQ_CD = B.SEQ_CD)
        WHEN NOT MATCHED THEN          
            INSERT 
                (USERID, SEQ_CD, ROOT_NAME, START_DATE, MEMBER_CNT, STATUS, CREATE_USERID, CREATE_DATE)
            VALUES
                (IN_USER_ID, V_SEQ_CD, IN_ROOT_NAME, IN_START_DATE, IN_MEMBER_CNT, IN_STATUS, IN_CREATE_USER_ID, TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'))
        WHEN MATCHED THEN
            UPDATE SET
                ROOT_NAME = IN_ROOT_NAME,
                START_DATE = IN_START_DATE,
                MEMBER_CNT = IN_MEMBER_CNT,
                STATUS = (CASE WHEN A.STATUS='S' THEN 'S' ELSE IN_STATUS END),
                UPDATE_USERID = IN_CREATE_USER_ID,
                UPDATE_DATE = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS');                
        
        DELETE FROM MTS_ROOT_PREPARE
        WHERE 1=1
            AND UPPER(USERID) = UPPER(IN_USER_ID)
            AND SEQ_CD = V_SEQ_CD;
             
        V_ROW_TOKENIZER := CLOB_TOKENIZER(IN_PREPARE_LIST, PKG_COMMON.ROW_SEP);
        WHILE V_ROW_TOKENIZER.has_more_tokens() = 1 LOOP
        
            V_ROWS := V_ROW_TOKENIZER.next_token();
            V_COL_TOKENIZER := CLOB_TOKENIZER(V_ROWS, PKG_COMMON.COL_SEP);
            
            WHILE V_COL_TOKENIZER.has_more_tokens() = 1 LOOP
            
                V_ITEM_NAME := V_COL_TOKENIZER.next_token();
                V_ITEM_AMT := V_COL_TOKENIZER.next_token();
                V_ITEM_CURRENCY := V_COL_TOKENIZER.next_token();
                
                INSERT INTO MTS_ROOT_PREPARE (
                    USERID,
                    SEQ_CD,
                    PREPARE_SEQ,
                    ITEM_NAME,
                    ITEM_AMT,
                    ITEM_CURRENCY,
                    CREATE_USERID,
                    CREATE_DATE
                ) VALUES (
                    IN_USER_ID,
                    V_SEQ_CD,
                    V_PREPARE_SEQ,
                    V_ITEM_NAME,
                    V_ITEM_AMT,
                    V_ITEM_CURRENCY,
                    IN_USER_ID,
                    TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')               
                );
                V_PREPARE_SEQ := V_PREPARE_SEQ + 1;
            END LOOP;
        END LOOP;

        DELETE FROM MTS_ROOT_DAY_MST
        WHERE 1=1
            AND UPPER(USERID) = UPPER(IN_USER_ID)
            AND SEQ_CD = V_SEQ_CD;

        V_ROW_TOKENIZER := CLOB_TOKENIZER(IN_DAYITEM_LIST, PKG_COMMON.ROW_SEP);
        WHILE V_ROW_TOKENIZER.has_more_tokens() = 1 LOOP
        
            V_ROWS := V_ROW_TOKENIZER.next_token();
            V_COL_TOKENIZER := CLOB_TOKENIZER(V_ROWS, PKG_COMMON.COL_SEP);
            
            WHILE V_COL_TOKENIZER.has_more_tokens() = 1 LOOP
            
                V_DAY_SEQ := V_COL_TOKENIZER.next_token();
                V_STAY_AREA_CD := V_COL_TOKENIZER.next_token();
                V_STAY_NATION_CD := V_COL_TOKENIZER.next_token();
                V_STAY_CITY_CD := V_COL_TOKENIZER.next_token();
                V_STAY_SEQ_CD := V_COL_TOKENIZER.next_token();
                V_STAY_AMT := V_COL_TOKENIZER.next_token();
                V_STAY_AMT_CUR := V_COL_TOKENIZER.next_token();
                V_ADDPAY_NAME := V_COL_TOKENIZER.next_token();
                V_ADDPAY_AMT := V_COL_TOKENIZER.next_token();
                V_ADDPAY_AMT_CUR := V_COL_TOKENIZER.next_token();
                V_MOVE_GB := V_COL_TOKENIZER.next_token();
                V_MOVE_DIST := V_COL_TOKENIZER.next_token();
                V_MOVE_DIST_GB := V_COL_TOKENIZER.next_token();
                V_MOVE_HOUR := V_COL_TOKENIZER.next_token();
                V_MOVE_MIN := V_COL_TOKENIZER.next_token();
                V_MOVE_AMT := V_COL_TOKENIZER.next_token();
                V_MOVE_AMT_CUR := V_COL_TOKENIZER.next_token();
                
                INSERT INTO MTS_ROOT_DAY_MST (
                    USERID,
                    SEQ_CD,
                    DAY_SEQ,
                    STAY_AREA_CD,
                    STAY_NATION_CD,
                    STAY_CITY_CD,
                    STAY_SEQ_CD,
                    STAY_AMT,
                    STAY_AMT_CURRENCY,
                    ADDPAY_NAME,
                    ADDPAY_AMT,
                    ADDPAY_AMT_CURRENCY,
                    MOVE_GB,
                    MOVE_DIST,
                    MOVE_DIST_GB,
                    MOVE_HOUR,
                    MOVE_MIN,
                    MOVE_AMT,
                    MOVE_AMT_CURRENCY,
                    CREATE_USERID,
                    CREATE_DATE
                ) VALUES (
                    IN_USER_ID,
                    V_SEQ_CD,
                    V_DAY_SEQ,
                    V_STAY_AREA_CD,
                    V_STAY_NATION_CD,
                    V_STAY_CITY_CD,
                    V_STAY_SEQ_CD,
                    V_STAY_AMT,
                    V_STAY_AMT_CUR,
                    V_ADDPAY_NAME,
                    V_ADDPAY_AMT,
                    V_ADDPAY_AMT_CUR,
                    V_MOVE_GB,
                    V_MOVE_DIST,
                    V_MOVE_DIST_GB,
                    V_MOVE_HOUR,
                    V_MOVE_MIN,
                    V_MOVE_AMT,
                    V_MOVE_AMT_CUR,
                    IN_USER_ID,
                    TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')               
                );
                
            END LOOP;
        END LOOP;
        
        DELETE FROM MTS_ROOT_DAY_PATH
        WHERE 1=1
            AND UPPER(USERID) = UPPER(IN_USER_ID)
            AND SEQ_CD = V_SEQ_CD;

        V_ROW_TOKENIZER := CLOB_TOKENIZER(IN_DAYITEMPATH_LIST, PKG_COMMON.ROW_SEP);
        WHILE V_ROW_TOKENIZER.has_more_tokens() = 1 LOOP
        
            V_ROWS := V_ROW_TOKENIZER.next_token();
            V_COL_TOKENIZER := CLOB_TOKENIZER(V_ROWS, PKG_COMMON.COL_SEP);
            
            WHILE V_COL_TOKENIZER.has_more_tokens() = 1 LOOP
            
                V_DAY_SEQ := V_COL_TOKENIZER.next_token();
                V_PATH_SEQ := V_COL_TOKENIZER.next_token();
                V_PATH_HOUR := V_COL_TOKENIZER.next_token();
                V_PATH_MIN := V_COL_TOKENIZER.next_token();
                V_STAY_AREA_CD := V_COL_TOKENIZER.next_token();
                V_STAY_NATION_CD := V_COL_TOKENIZER.next_token();
                V_STAY_CITY_CD := V_COL_TOKENIZER.next_token();
                V_STAY_SEQ_CD := V_COL_TOKENIZER.next_token();
                V_STAY_AMT := V_COL_TOKENIZER.next_token();
                V_STAY_AMT_CUR := V_COL_TOKENIZER.next_token();
                V_SEE_GUBUN := V_COL_TOKENIZER.next_token();
                V_MOVE_GB := V_COL_TOKENIZER.next_token();
                V_MOVE_DIST := V_COL_TOKENIZER.next_token();
                V_MOVE_DIST_GB := V_COL_TOKENIZER.next_token();
                V_MOVE_HOUR := V_COL_TOKENIZER.next_token();
                V_MOVE_MIN := V_COL_TOKENIZER.next_token();
                V_MOVE_AMT := V_COL_TOKENIZER.next_token();
                V_MOVE_AMT_CUR := V_COL_TOKENIZER.next_token();
                
                INSERT INTO MTS_ROOT_DAY_PATH (
                    USERID,
                    SEQ_CD,
                    DAY_SEQ,
                    PATH_SEQ,
                    PATH_HOUR,
                    PATH_MIN,
                    SEE_AREA_CD,
                    SEE_NATION_CD,
                    SEE_CITY_CD,
                    SEE_SEQ_CD,
                    PAY_AMT,
                    PAY_AMT_CURRENCY,
                    SEE_GUBUN,
                    MOVE_GB,
                    MOVE_DIST,
                    MOVE_DIST_GB,
                    MOVE_HOUR,
                    MOVE_MIN,
                    MOVE_AMT,
                    MOVE_AMT_CURRENCY,
                    CREATE_USERID,
                    CREATE_DATE
                ) VALUES (
                    IN_USER_ID,
                    V_SEQ_CD,
                    V_DAY_SEQ,
                    V_PATH_SEQ,
                    V_PATH_HOUR,
                    V_PATH_MIN,
                    V_STAY_AREA_CD,
                    V_STAY_NATION_CD,
                    V_STAY_CITY_CD,
                    V_STAY_SEQ_CD,
                    V_STAY_AMT,
                    V_STAY_AMT_CUR,
                    V_SEE_GUBUN,
                    V_MOVE_GB,
                    V_MOVE_DIST,
                    V_MOVE_DIST_GB,
                    V_MOVE_HOUR,
                    V_MOVE_MIN,
                    V_MOVE_AMT,
                    V_MOVE_AMT_CUR,
                    IN_USER_ID,
                    TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')               
                );
                
            END LOOP;
        END LOOP;
        
        COMMIT;
        
        OUT_SEQ_CD := V_SEQ_CD;
        OUT_ERR_CD := PKG_COMMON.INIT_ERR_CD;
        OUT_ERR_MSG := PKG_COMMON.INIT_ERR_MSG;
        
    EXCEPTION
        WHEN OTHERS THEN
            OUT_ERR_CD  := TO_CHAR(SQLCODE);
            OUT_ERR_MSG := SQLERRM;
            ROLLBACK;
    END SI_ROOT;

    PROCEDURE SS_ROOT_LIST (
        IN_GUBUN                  IN  VARCHAR2,
        IN_TEXT                   IN  VARCHAR2,
        IN_ONLY_MYSELF            IN  VARCHAR2,
        IN_NEW_EXIST              IN  VARCHAR2,
        IN_USER_ID                IN  VARCHAR2,
        IN_PAGE_NO                IN  NUMBER,
        IN_PAGE_SIZE              IN  NUMBER,
        OUT_ERR_CD                OUT VARCHAR2,
        OUT_ERR_MSG               OUT VARCHAR2,
        OUT_TOTAL_COUNT           OUT NUMBER,
        OUT_DATA                  OUT PKG_COMMON.OUT_TABLE
    ) IS
    BEGIN
        
    SELECT
       COUNT(*) INTO OUT_TOTAL_COUNT
    FROM
        MTS_ROOT_MST A
    WHERE 1=1
        AND 1 = 
            (CASE
                WHEN IN_ONLY_MYSELF IS NOT NULL AND IN_ONLY_MYSELF = 'Y' THEN
                    CASE WHEN UPPER(A.CREATE_USERID) = UPPER(IN_USER_ID) THEN 1 ELSE 0 END  
                ELSE 1
            END) 
        AND 1 =
            (CASE
                WHEN IN_TEXT IS NOT NULL THEN 
                    CASE WHEN IN_GUBUN = 'R' THEN
                        CASE WHEN UPPER(A.ROOT_NAME) LIKE '%' || UPPER(IN_TEXT) || '%' THEN 1 ELSE 0 END
                    ELSE
                        CASE WHEN UPPER(A.CREATE_USERID) IN (SELECT UPPER(USERID) FROM MTS_USERINFO WHERE UPPER(NICKNAME) LIKE '%' || UPPER(IN_TEXT) || '%') THEN 1 ELSE 0 END
                    END
                ELSE 1
            END)
        AND 1 =
            (CASE
                WHEN A.STATUS='T' AND UPPER(A.CREATE_USERID) = UPPER(IN_USER_ID) THEN 1
                WHEN A.STATUS='S' THEN 1
                ELSE 0
             END)
        AND 1 =
            (CASE
                WHEN IN_NEW_EXIST IS NOT NULL THEN
                    CASE WHEN IN_NEW_EXIST = 'Y' THEN
                        CASE WHEN (SELECT COUNT(*) FROM MTS_REPBOARD WHERE UPPER(BOARD_KEY) = UPPER('RT' || A.USERID || A.SEQ_CD) AND STATUS='N') = 0 THEN 0
                        ELSE 1 
                        END
                    ELSE 1
                    END
                ELSE 1
            END);
            
    OPEN OUT_DATA FOR
        SELECT ROW_NUM, 
              USERID,         SEQ_CD,         USERNAME,         ROOT_NAME,        START_DATE,
              START_YY,       START_MM,       START_DD,         MEMBER_CNT,       STATUS,
              STATUS_TEXT,    RECO_CNT,       NEW_TEXT,         CREATE_DATE,
              BG_COLOR,        BG_DECO_TYPE,      BG_DECO_FILENAME
          FROM (
               SELECT ROWNUM AS ROW_NUM,
                  USERID,         SEQ_CD,         USERNAME,         ROOT_NAME,        START_DATE,
                  START_YY,       START_MM,       START_DD,         MEMBER_CNT,       STATUS,
                  STATUS_TEXT,    RECO_CNT,       NEW_TEXT,         CREATE_DATE,
                  BG_COLOR,        BG_DECO_TYPE,      BG_DECO_FILENAME
               FROM (
                     SELECT
                        A.USERID,
                        A.SEQ_CD,
                        PKG_COMMON.GET_NICKNAME(A.CREATE_USERID) AS USERNAME,
                        PKG_COMMON.GET_BOARD_TITLE(A.CREATE_USERID, A.ROOT_NAME) AS ROOT_NAME,
                        A.START_DATE,
                        SUBSTR(A.START_DATE,1,4) AS START_YY,
                        SUBSTR(A.START_DATE,5,2) AS START_MM,
                        SUBSTR(A.START_DATE,7,2) AS START_DD,
                        A.MEMBER_CNT,
                        A.STATUS,
                        DECODE(A.STATUS,'S','완성','T','임시저장','') AS STATUS_TEXT,
                        A.RECO_CNT,
                        CASE
                            WHEN (SELECT COUNT(*) FROM MTS_REPBOARD WHERE UPPER(BOARD_KEY) = UPPER('RT' || A.USERID || A.SEQ_CD) AND STATUS='N') = 0 THEN '읽음' ELSE '<font color=red>new</font>'
                        END AS NEW_TEXT,
                        A.CREATE_DATE,
                        C.BG_COLOR,
                        C.BG_DECO_TYPE,
                        C.BG_DECO_FILENAME
                    FROM
                        MTS_ROOT_MST A, MTS_USERINFO_DECO C
                    WHERE 1=1
                        AND A.CREATE_USERID = C.USERID
                        AND 1 = 
                            (CASE
                                WHEN IN_ONLY_MYSELF IS NOT NULL AND IN_ONLY_MYSELF = 'Y' THEN
                                    CASE WHEN UPPER(A.CREATE_USERID) = UPPER(IN_USER_ID) THEN 1 ELSE 0 END  
                                ELSE 1
                            END) 
                        AND 1 =
                            (CASE
                                WHEN IN_TEXT IS NOT NULL THEN 
                                    CASE WHEN IN_GUBUN = 'R' THEN
                                        CASE WHEN UPPER(A.ROOT_NAME) LIKE '%' || UPPER(IN_TEXT) || '%' THEN 1 ELSE 0 END
                                    ELSE
                                        CASE WHEN UPPER(A.CREATE_USERID) IN (SELECT UPPER(USERID) FROM MTS_USERINFO WHERE UPPER(NICKNAME) LIKE '%' || UPPER(IN_TEXT) || '%') THEN 1 ELSE 0 END
                                    END
                                ELSE 1
                            END)
                        AND 1 =
                            (CASE
                                WHEN A.STATUS='T' AND UPPER(A.CREATE_USERID) = UPPER(IN_USER_ID) THEN 1
                                WHEN A.STATUS='S' THEN 1
                                ELSE 0
                             END)      
                        AND 1 =
                            (CASE
                                WHEN IN_NEW_EXIST IS NOT NULL THEN
                                    CASE WHEN IN_NEW_EXIST = 'Y' THEN
                                        CASE WHEN (SELECT COUNT(*) FROM MTS_REPBOARD WHERE UPPER(BOARD_KEY) = UPPER('RT' || A.USERID || A.SEQ_CD) AND STATUS='N') = 0 THEN 0
                                        ELSE 1 
                                        END
                                    ELSE 1
                                    END
                                ELSE 1
                            END)
                    ORDER BY CREATE_DATE DESC
                    ) YY
                WHERE ROWNUM <= IN_PAGE_NO * IN_PAGE_SIZE
             ) ZZ
         WHERE ROW_NUM > (IN_PAGE_NO - 1) * IN_PAGE_SIZE;
        
        OUT_ERR_CD := PKG_COMMON.VALUE_BLANK;
        OUT_ERR_MSG := PKG_COMMON.VALUE_BLANK;
        
    EXCEPTION
        WHEN OTHERS THEN
            OUT_ERR_CD  := TO_CHAR(SQLCODE);
            OUT_ERR_MSG := SQLERRM;
            CLOSE OUT_DATA;
    END SS_ROOT_LIST;

    PROCEDURE SS_ROOT_DETAIL (
        IN_REQ_USER_ID           IN  VARCHAR2,
        IN_REQ_SEQ_CODE          IN  VARCHAR2,
        IN_USER_ID               IN  VARCHAR2,
        IN_SCORE                 IN  NUMBER,
        OUT_ERR_CD               OUT VARCHAR2,
        OUT_ERR_MSG              OUT VARCHAR2,
        OUT_DATA                 OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_PRE             OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_DAY             OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_DPATH           OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_REPBOARD        OUT PKG_COMMON.OUT_TABLE
    ) IS
    
        V_CREATE_USERID          MTS_ROOT_MST.CREATE_USERID%TYPE := PKG_COMMON.VALUE_BLANK;
    
    BEGIN
    
        SELECT 
            CREATE_USERID INTO V_CREATE_USERID 
        FROM
            MTS_ROOT_MST
        WHERE 1=1
            AND UPPER(USERID) = UPPER(IN_REQ_USER_ID)
            AND SEQ_CD = IN_REQ_SEQ_CODE;
    
        OPEN OUT_DATA FOR
            SELECT
                USERID,
                SEQ_CD,
                PKG_COMMON.GET_NICKNAME(A.CREATE_USERID) AS USERNAME,
                ROOT_NAME,
                START_DATE,
                MEMBER_CNT,
                STATUS,
                DECODE(STATUS,'S','완성','T','임시저장','') AS STATUS_TEXT,
                RECO_CNT,
                CREATE_DATE
            FROM
                MTS_ROOT_MST A
            WHERE 1=1
                AND UPPER(USERID) = UPPER(IN_REQ_USER_ID)
                AND SEQ_CD = IN_REQ_SEQ_CODE;
    
        OPEN OUT_DATA_PRE FOR
            SELECT
                USERID,
                SEQ_CD,
                PREPARE_SEQ,
                ITEM_NAME,
                ITEM_AMT,
                ITEM_CURRENCY,
                PKG_COMMON.GET_CURRENCY_NAME(ITEM_CURRENCY) AS ITEM_CURRENCY_TEXT
            FROM
                MTS_ROOT_PREPARE
            WHERE 1=1
                AND UPPER(USERID) = UPPER(IN_REQ_USER_ID)
                AND SEQ_CD = IN_REQ_SEQ_CODE
            ORDER BY PREPARE_SEQ;                             

        OPEN OUT_DATA_DAY FOR
            SELECT
                A.USERID,
                A.SEQ_CD,
                A.DAY_SEQ,
                B.STAY_GB,
                A.STAY_AREA_CD,
                A.STAY_NATION_CD,
                A.STAY_CITY_CD,
                A.STAY_SEQ_CD,
                B.STAY_NAME || '(' || PKG_COMMON.GET_ACCOMODATION_NAME(STAY_GB) || ')'  AS STAY_NAME,
                B.TEL_NO,
                B.ADDRESS,
                B.HOMEPAGE,
                A.STAY_AMT,
                A.STAY_AMT_CURRENCY,
                PKG_COMMON.GET_CURRENCY_NAME(A.STAY_AMT_CURRENCY) AS STAY_AMT_CURRENCY_TEXT,
                A.ADDPAY_NAME,
                A.ADDPAY_AMT,
                A.ADDPAY_AMT_CURRENCY,
                PKG_COMMON.GET_CURRENCY_NAME(A.ADDPAY_AMT_CURRENCY) AS ADDPAY_AMT_CURRENCY_TEXT,
                A.MOVE_GB,
                PKG_COMMON.GET_MOVE_GUBUN_NAME(A.MOVE_GB) AS MOVE_NAME,
                A.MOVE_DIST,
                A.MOVE_DIST_GB,
                A.MOVE_HOUR,
                A.MOVE_MIN,
                A.MOVE_AMT,
                A.MOVE_AMT_CURRENCY,
                PKG_COMMON.GET_CURRENCY_NAME(A.MOVE_AMT_CURRENCY) AS MOVE_AMT_CURRENCY_TEXT,
                CASE WHEN C.USERID IS NOT NULL AND (UPPER(IN_USER_ID) = UPPER(A.USERID) OR D.PRIVATE_YN = 'N') THEN 'Y' ELSE 'N' END AS WRITE_GUBUN,
                C.STAY_AMT AS R_STAY_AMT,
                C.STAY_AMT_CURRENCY AS R_STAY_AMT_CURRENCY,
                PKG_COMMON.GET_CURRENCY_NAME(C.STAY_AMT_CURRENCY) AS R_STAY_AMT_CURRENCY_TEXT,
                C.ADDPAY_AMT AS R_ADDPAY_AMT,
                C.ADDPAY_AMT_CURRENCY AS R_ADDPAY_AMT_CURRENCY,
                PKG_COMMON.GET_CURRENCY_NAME(C.ADDPAY_AMT_CURRENCY) AS R_ADDPAY_AMT_CURRENCY_TEXT,
                C.MOVE_AMT AS R_MOVE_AMT,
                C.MOVE_AMT_CURRENCY AS R_MOVE_AMT_CURRENCY,
                PKG_COMMON.GET_CURRENCY_NAME(C.MOVE_AMT_CURRENCY) AS R_MOVE_AMT_CURRENCY_TEXT
            FROM
                MTS_ROOT_DAY_MST A, MTS_STAYINFO B, MTS_DAILY_DAY_MST C, MTS_DAILY_MST D
            WHERE 1=1
                AND A.STAY_AREA_CD=B.AREA_CD(+)
                AND A.STAY_NATION_CD=B.NATION_CD(+)
                AND A.STAY_CITY_CD=B.CITY_CD(+)
                AND A.STAY_SEQ_CD=B.SEQ_CD(+)
                AND UPPER(A.USERID) = UPPER(C.USERID(+))
                AND A.SEQ_CD = C.SEQ_CD(+)
                AND A.DAY_SEQ = C.DAY_SEQ(+)
                AND UPPER(A.USERID) = UPPER(D.USERID(+))
                AND A.SEQ_CD = D.SEQ_CD(+)
                AND UPPER(A.USERID) = UPPER(IN_REQ_USER_ID)
                AND A.SEQ_CD = IN_REQ_SEQ_CODE
            ORDER BY DAY_SEQ;                             
             
        OPEN OUT_DATA_DPATH FOR
            SELECT
                A.USERID,
                A.SEQ_CD,
                A.DAY_SEQ,
                A.PATH_SEQ,
                A.PATH_HOUR,
                A.PATH_MIN,
                A.SEE_AREA_CD,
                A.SEE_NATION_CD,
                A.SEE_CITY_CD,
                A.SEE_SEQ_CD,
                PKG_COMMON.GET_AREA_NAME(A.SEE_AREA_CD) AS SEE_AREA_NAME,
                (SELECT NAME FROM MTS_NATIONINFO WHERE AREA_CD = A.SEE_AREA_CD AND NATION_CD = A.SEE_NATION_CD) AS SEE_NATION_NAME,
                (SELECT NAME FROM MTS_CITYINFO WHERE AREA_CD = A.SEE_AREA_CD AND NATION_CD = A.SEE_NATION_CD AND CITY_CD=A.SEE_CITY_CD) AS SEE_CITY_NAME,
                CASE 
                    WHEN A.SEE_GUBUN = 'LI' THEN
                        '<span><font color=#ff8000 class="buttonType3 type1">볼</font></span> ' || (SELECT SEE_NAME FROM MTS_SEEINFO WHERE AREA_CD=A.SEE_AREA_CD AND NATION_CD=A.SEE_NATION_CD AND CITY_CD=A.SEE_CITY_CD AND SEQ_CD=A.SEE_SEQ_CD)
                    WHEN A.SEE_GUBUN = 'FI' THEN
                        '<span><font color=#8000ff class="buttonType3 type2">먹</font></span> ' || (SELECT SHOP_NAME FROM MTS_FOODINFO WHERE AREA_CD=A.SEE_AREA_CD AND NATION_CD=A.SEE_NATION_CD AND CITY_CD=A.SEE_CITY_CD AND SEQ_CD=A.SEE_SEQ_CD)
                    ELSE ''
                END AS SEE_NAME ,
                CASE 
                    WHEN A.SEE_GUBUN = 'LI' THEN
                        (SELECT ADDRESS FROM MTS_SEEINFO WHERE AREA_CD=A.SEE_AREA_CD AND NATION_CD=A.SEE_NATION_CD AND CITY_CD=A.SEE_CITY_CD AND SEQ_CD=A.SEE_SEQ_CD)
                    WHEN A.SEE_GUBUN = 'FI' THEN
                        (SELECT ADDRESS FROM MTS_FOODINFO WHERE AREA_CD=A.SEE_AREA_CD AND NATION_CD=A.SEE_NATION_CD AND CITY_CD=A.SEE_CITY_CD AND SEQ_CD=A.SEE_SEQ_CD)
                    ELSE ''
                END AS ADDRESS ,
                CASE 
                    WHEN A.SEE_GUBUN = 'LI' THEN
                        (SELECT YOUTUBE FROM MTS_SEEINFO WHERE AREA_CD=A.SEE_AREA_CD AND NATION_CD=A.SEE_NATION_CD AND CITY_CD=A.SEE_CITY_CD AND SEQ_CD=A.SEE_SEQ_CD)
                    WHEN A.SEE_GUBUN = 'FI' THEN
                        (SELECT YOUTUBE FROM MTS_FOODINFO WHERE AREA_CD=A.SEE_AREA_CD AND NATION_CD=A.SEE_NATION_CD AND CITY_CD=A.SEE_CITY_CD AND SEQ_CD=A.SEE_SEQ_CD)
                    ELSE ''
                END AS YOUTUBE ,
                A.PAY_AMT,
                A.PAY_AMT_CURRENCY,
                A.SEE_GUBUN,
                PKG_COMMON.GET_CURRENCY_NAME(A.PAY_AMT_CURRENCY) AS PAY_AMT_CURRENCY_TEXT,
                A.MOVE_GB,
                PKG_COMMON.GET_MOVE_GUBUN_NAME(A.MOVE_GB) AS MOVE_NAME,
                A.MOVE_DIST,
                A.MOVE_DIST_GB,
                A.MOVE_HOUR,
                A.MOVE_MIN,
                A.MOVE_AMT,
                A.MOVE_AMT_CURRENCY,
                PKG_COMMON.GET_CURRENCY_NAME(A.MOVE_AMT_CURRENCY) AS MOVE_AMT_CURRENCY_TEXT,
                C.PAY_AMT AS R_PAY_AMT,
                C.PAY_AMT_CURRENCY AS R_PAY_AMT_CURRENCY,
                PKG_COMMON.GET_CURRENCY_NAME(C.PAY_AMT_CURRENCY) AS R_PAY_AMT_CURRENCY_TEXT,
                C.MOVE_AMT AS R_MOVE_AMT,
                C.MOVE_AMT_CURRENCY AS R_MOVE_AMT_CURRENCY ,
                PKG_COMMON.GET_CURRENCY_NAME(C.MOVE_AMT_CURRENCY) AS R_MOVE_AMT_CURRENCY_TEXT
            FROM
                MTS_ROOT_DAY_PATH A, MTS_DAILY_DAY_PATH C
            WHERE 1=1
                AND A.SEQ_CD = C.SEQ_CD(+)
                AND A.DAY_SEQ = C.DAY_SEQ(+)
                AND A.PATH_SEQ = C.PATH_SEQ(+)
                AND UPPER(A.USERID) = UPPER(C.USERID(+))
                AND UPPER(A.USERID) = UPPER(IN_REQ_USER_ID)
                AND A.SEQ_CD = IN_REQ_SEQ_CODE
            ORDER BY A.DAY_SEQ, A.PATH_SEQ;
                
        PKG_BOARD_MANAGE.SS_REP_BOARD_LIST('RT' || IN_REQ_USER_ID || IN_REQ_SEQ_CODE, OUT_DATA_REPBOARD);
                
        IF UPPER(V_CREATE_USERID) = UPPER(IN_USER_ID) THEN
            UPDATE MTS_REPBOARD SET STATUS='Y' WHERE UPPER(BOARD_KEY) = UPPER('RT' || IN_REQ_USER_ID || IN_REQ_SEQ_CODE) AND STATUS='N';
        ELSE
            PKG_COMMON.SI_USERLEVEL_ADD(V_CREATE_USERID, TRUNC(IN_SCORE / 10));
        END IF; 

        IF IN_USER_ID IS NOT NULL THEN
            PKG_COMMON.SI_USERLEVEL_ADD(IN_USER_ID, IN_SCORE);
        END IF;
    
        COMMIT;
            
    EXCEPTION
        WHEN OTHERS THEN
            OUT_ERR_CD  := TO_CHAR(SQLCODE);
            OUT_ERR_MSG := SQLERRM;
            CLOSE OUT_DATA;
            CLOSE OUT_DATA_PRE;
            CLOSE OUT_DATA_DAY;
            CLOSE OUT_DATA_DPATH;
            CLOSE OUT_DATA_REPBOARD;
            ROLLBACK;
    END SS_ROOT_DETAIL;
     
    PROCEDURE SS_ROOT_COMBO_FORMODIFY (
        IN_USER_ID                IN  VARCHAR2,
        IN_SEQ_CODE               IN  VARCHAR2,
        OUT_ERR_CD                OUT VARCHAR2,
        OUT_ERR_MSG               OUT VARCHAR2,
        OUT_DATA_NATION           OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_CITY             OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_SEEINFO          OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_FOODINFO         OUT PKG_COMMON.OUT_TABLE,
        OUT_DATA_STAYINFO         OUT PKG_COMMON.OUT_TABLE
    ) IS
    
    BEGIN
    
        OPEN OUT_DATA_NATION FOR
            SELECT
                A.DAY_SEQ,
                A.PATH_SEQ,
                B.AREA_CD,
                B.NATION_CD,
                B.NAME,
                B.ENAME,
                B.DANGER_CD,
                B.LAT,
                B.LNG
            FROM
                MTS_ROOT_DAY_PATH A,MTS_NATIONINFO B
            WHERE 1=1
                AND A.SEE_AREA_CD = B.AREA_CD
                AND UPPER(A.USERID) = UPPER(IN_USER_ID)
                AND A.SEQ_CD = IN_SEQ_CODE
            ORDER BY DAY_SEQ, PATH_SEQ, NAME;
             
        OPEN OUT_DATA_CITY FOR
            SELECT
                A.DAY_SEQ,
                A.PATH_SEQ,
                B.AREA_CD,
                B.NATION_CD,
                B.CITY_CD,
                B.NAME,
                B.ENAME,
                B.LAT,
                B.LNG
            FROM
                MTS_ROOT_DAY_PATH A,MTS_CITYINFO B
            WHERE 1=1
                AND A.SEE_AREA_CD = B.AREA_CD
                AND A.SEE_NATION_CD = B.NATION_CD
                AND UPPER(A.USERID) = UPPER(IN_USER_ID)
                AND A.SEQ_CD = IN_SEQ_CODE
            ORDER BY DAY_SEQ, PATH_SEQ, NAME;
            
        OPEN OUT_DATA_SEEINFO FOR
            SELECT
                A.DAY_SEQ,
                A.PATH_SEQ,
                B.SEQ_CD,
                B.SEE_NAME AS NAME,
                B.LAT,
                B.LNG,
                B.FEE_AMT,
                B.FEE_CURRENCY
            FROM
                MTS_ROOT_DAY_PATH A,MTS_SEEINFO B
            WHERE 1=1
                AND A.SEE_AREA_CD = B.AREA_CD
                AND A.SEE_NATION_CD = B.NATION_CD
                AND A.SEE_CITY_CD = B.CITY_CD
                AND UPPER(A.USERID) = UPPER(IN_USER_ID)
                AND A.SEQ_CD = IN_SEQ_CODE
            ORDER BY DAY_SEQ, PATH_SEQ, SEE_NAME;

        OPEN OUT_DATA_FOODINFO FOR
            SELECT
                A.DAY_SEQ,
                A.PATH_SEQ,
                B.SEQ_CD,
                B.FOOD_NAME || '(' || B.SHOP_NAME || ')' AS NAME,
                B.LAT,
                B.LNG
            FROM
                MTS_ROOT_DAY_PATH A,MTS_FOODINFO B
            WHERE 1=1
                AND A.SEE_AREA_CD = B.AREA_CD
                AND A.SEE_NATION_CD = B.NATION_CD
                AND A.SEE_CITY_CD = B.CITY_CD
                AND UPPER(A.USERID) = UPPER(IN_USER_ID)
                AND A.SEQ_CD = IN_SEQ_CODE
            ORDER BY DAY_SEQ, PATH_SEQ, FOOD_NAME;
            
        OPEN OUT_DATA_STAYINFO FOR
            SELECT
                A.DAY_SEQ,
                B.AREA_CD,
                B.NATION_CD,
                B.CITY_CD,
                B.SEQ_CD,
                B.STAY_NAME,
                B.LAT,
                B.LNG
            FROM
                MTS_ROOT_DAY_MST A, MTS_STAYINFO B
            WHERE 1=1
                AND A.STAY_AREA_CD = B.AREA_CD
                AND A.STAY_NATION_CD = B.NATION_CD
                AND A.STAY_CITY_CD = B.CITY_CD
                AND B.STAY_GB = (SELECT STAY_GB FROM MTS_STAYINFO WHERE AREA_CD=A.STAY_AREA_CD AND NATION_CD=A.STAY_NATION_CD AND CITY_CD=A.STAY_CITY_CD AND SEQ_CD=B.SEQ_CD)
                AND UPPER(A.USERID) = UPPER(IN_USER_ID)
                AND A.SEQ_CD = IN_SEQ_CODE
            ORDER BY DAY_SEQ;

        OUT_ERR_CD := PKG_COMMON.VALUE_BLANK;
        OUT_ERR_MSG := PKG_COMMON.VALUE_BLANK;
                                                   
    EXCEPTION
        WHEN OTHERS THEN
            OUT_ERR_CD  := TO_CHAR(SQLCODE);
            OUT_ERR_MSG := SQLERRM;
            CLOSE OUT_DATA_NATION;
            CLOSE OUT_DATA_CITY;
            CLOSE OUT_DATA_SEEINFO;
            CLOSE OUT_DATA_STAYINFO;
    END SS_ROOT_COMBO_FORMODIFY;
       
    PROCEDURE SS_ROOT_LIST_COMBO (
        IN_USER_ID                IN  VARCHAR2,
        OUT_ERR_CD                OUT VARCHAR2,
        OUT_ERR_MSG               OUT VARCHAR2,
        OUT_DATA                  OUT PKG_COMMON.OUT_TABLE
    ) IS
    BEGIN
        
    OPEN OUT_DATA FOR
         SELECT
            USERID,
            SEQ_CD,
            ROOT_NAME,
            START_DATE
        FROM
            MTS_ROOT_MST A
        WHERE 1=1
            AND UPPER(USERID) = UPPER(IN_USER_ID);
            
        OUT_ERR_CD := PKG_COMMON.VALUE_BLANK;
        OUT_ERR_MSG := PKG_COMMON.VALUE_BLANK;
        
    EXCEPTION
        WHEN OTHERS THEN
            OUT_ERR_CD  := TO_CHAR(SQLCODE);
            OUT_ERR_MSG := SQLERRM;
            CLOSE OUT_DATA;
    END SS_ROOT_LIST_COMBO;
        
END PKG_ROOT_MANAGE;
/
