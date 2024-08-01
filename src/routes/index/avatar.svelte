<script>
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Popover from '$lib/components/ui/popover';
    import { Button } from "$lib/components/ui/button/index.js";

	import { cn } from '$lib/utils.js';
	let className = undefined;
    let src = '/defavatar.png';

	export { className as class, src };
</script>


<div class={cn('w-12 h-12', className)} {...$$restProps}>
    <Popover.Root>
        <Popover.Trigger>
            <Avatar.Root>
                <Avatar.Image {src} alt="用户头像" />
                <Avatar.Fallback>未登录</Avatar.Fallback>
            </Avatar.Root>
        </Popover.Trigger>
        <Popover.Content>
            <Button variant="link" href="/login" class="w-full">登录</Button>
        </Popover.Content>
    </Popover.Root>
</div>

