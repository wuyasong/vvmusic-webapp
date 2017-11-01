{{each list as item}}
    <li data-id="{{ item.categoryID }}" data-title="{{ item.name }}">{{ item.name }}</li>
{{/each}}