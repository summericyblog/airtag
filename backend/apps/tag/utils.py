from .models import Tag, TagPath


def add_tagtree(tagtree):
    def add_tagtree_element(ancestor, taglist, depth):
        tag_ancestor, _ = Tag.objects.get_or_create(name=ancestor)
        if isinstance(taglist, list):
            for child in taglist:
                child_k = list(child.keys())[0]
                child_v = child[child_k]
                tag_child_k, _ = Tag.objects.get_or_create(name=child_k)
                new_tagpath, _ = TagPath.objects.get_or_create(
                    ancestor=tag_ancestor,
                    descendant=tag_child_k,
                    pathlength=depth,
                )
                add_tagtree_element(ancestor, child_v, depth + 1)
                add_tagtree_element(child_k, child_v, 1)
        return 0

    for t in tagtree:
        ancestor = list(t.keys())[0]
        tag_ancestor, _ = Tag.objects.get_or_create(name=ancestor)
        new_tagpath, _ = TagPath.objects.get_or_create(
            ancestor=None,
            descendant=tag_ancestor,
            pathlength=0,
        )
        taglist = t[ancestor]
        add_tagtree_element(ancestor, taglist, 1)
    return 0


def gen_tagtree():
    def gen_tagtree_element(ancestor):
        children = TagPath.objects.filter(ancestor__name=ancestor)
        if children is None:
            return None
        else:
            ret = []
            for c in children:
                ret.append(
                    {c.descendant.name: gen_tagtree_element(c.descendant.name)}
                )
        return ret

    ret = []
    roots = TagPath.objects.filter(ancestor=None)
    for r in roots:
        ret.append({r.descendant.name: gen_tagtree_element(r.descendant.name)})
    return ret
