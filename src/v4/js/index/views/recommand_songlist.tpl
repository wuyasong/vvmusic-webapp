{{each list as item}}
<li data-songID="{{item.songID}}" data-selector="{{selector}}">
	{{if item.CDNPiclink1}}
    <p class="recsong-img" style="background-image: url({{item.CDNPiclink1}})"></p>
    {{else}}
    <p class="recsong-img" style="background-image: url({{defaultImg}})"></p>
    {{/if}}
    <p class="recsong-info">
        <span class="recsong-song">{{item.name}}</span>
        <span class="recsong-singer">{{item.singerName}}-{{(item.fileSize / 1024 / 1024).toFixed(1)}}M</span>
    </p>
    <p class="recsong-btn-box">
        <button class="recsong-btn" data-songID="{{item.songID}}" data-selector="{{selector}}" data-index="{{$index}}">{{!isRoom ? '演唱' : '点歌'}}</button>
    </p>
</li>
{{/each}}