function GradeVote() {
    this.VoteMaxStar = 1;
    this.VoteCounter = 1;
    this.VoteContent = new Array();
    this.GradeVoteImage1 = "";
    this.GradeVoteImage2 = "";
    this.Grade = 3;

    this.AddContent = function (sNA) {
        this.VoteContent["_" + this.VoteCounter] = sNA;
        this.VoteCounter++;
    }
    /*创建评分星星*/
    this.CreateVote = function (MaxStar, DefaultStar) {
        this.Grade = DefaultStar;
        var i = 1, j = 1;
        var VoteImgHTML = "";
        this.VoteMaxStar = MaxStar;
        for (i = 1; i <= MaxStar; i++) {
            //VoteImgHTML += "<img id=\"_GradeVoteID" + i + "\" src=\"" + (j <= DefaultStar ? this.GradeVoteImage1 : this.GradeVoteImage2) + "\" border=\"0\" onMouSEOver=\"WindowVote.HitVote('" + i + "');\" onClick=\"WindowVote.VoteSubmit('" + i + "');\">";
            VoteImgHTML += "<img id=\"_GradeVoteID" + i + "\" src=\"" + (j <= DefaultStar ? this.GradeVoteImage1 : this.GradeVoteImage2) + "\" border=\"0\" onMouSEOver=\"WindowVote.HitVote('" + i + "');\">";
            j++;
        }
        if (document.getElementById("GradeVoteArea") != null) {
            document.getElementById("GradeVoteArea").innerHTML = VoteImgHTML;
        }
        else {
            alert("Object not found!!");
        }
    }
    /* 评分等级内容*/
    this.VoteScoreContent = function (sID) {
        var VoteContent = this.VoteContent["_" + sID];
        if (VoteContent == "undefined" || VoteContent == null) VoteContent = "Not defined!!";
        return VoteContent;
    }
    /*鼠标放到星星上*/
    this.HitVote = function (sID) {
        //Grade=sID;
        this.Grade = sID;
        var i = 1;
        for (i = 1; i <= sID; i++) {
            document.getElementById("_GradeVoteID" + i).src = this.GradeVoteImage1;
        }
        document.getElementById("GradeVoteScore").innerHTML = this.VoteScoreContent(sID);
        sID++;
        for (i = sID; i <= this.VoteMaxStar; i++) {
            document.getElementById("_GradeVoteID" + i).src = this.GradeVoteImage2;
        }
        
    }
    /*提交评分*/
//    this.VoteSubmit = function (sID) {
//        this.Grade = sID;
//        alert("您打了" + sID + "分！");
//    }
    this.GetCount = function () {
        return sID;
    }
}