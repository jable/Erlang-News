<div class="right_recent">
    <a href="redirect.php?id={id}&url={URL}" onmouseover="JavaScript:windows.status='this link blaber';return true;" onmouseout="window.status=''";>{title}</a>
    <div style="position: relative; height: 30px;">
    <div class="absolute_16x16_centerback" 
         style="background-image: url('http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/thumb-up-icon.png');left:10px;"
         id="{id}_vote_up" onclick="articleAction(this,1,false)"></div>
    <div class="absolute_16x16_centerback" 
         style="background-image: url('http://icons.iconarchive.com/icons/fatcow/farm-fresh/16/thumb-down-icon.png');left:50px;"
         id="{id}_vote_down" onclick="articleAction(this,0,false)"></div>
    <div class="absolute_16x16_centerback" 
         style="background-color:black;left:10px;display:none;" 
         id="{id}_vote_up_active" onclick="articleAction(this,0,true)"></div>
         <div class="absolute_16x16_centerback" 
         style="background-color:blue;left:50px;display:none;" 
         id="{id}_vote_down_active" onclick="articleAction(this,0,true)"></div>
    <div class="absolute_16x16_centerback" 
         style="background-image: url('http://icons.iconarchive.com/icons/kyo-tux/aeon/16/Sign-Alert-icon.png');left:90px;"
         id="{id}_report" onclick="articleAction(this,2,false)"></div>
    </div> 
</div>