from .models import Tag, TagPath


def add_tagtree(tagtree):
    """
    Read tags from the config file and write to the database
    """

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
            pathlength=1,
        )
        taglist = t[ancestor]
        add_tagtree_element(ancestor, taglist, 1)
    return 0


def gen_tagtree():
    """
    read from the database and overwrite to the config file.
    """

    def gen_tagtree_element(ancestor):
        children = TagPath.objects.filter(
            ancestor__name=ancestor, pathlength=1
        )
        if not children:
            return []
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


def add_one_tag(name, description, father):
    # add one tag
    tag = Tag.objects.filter(name=name)
    if tag.exists():
        return ("Existed.", 1)
    else:
        if father is None:
            tag = Tag(name=name, description=description)
            tag.save()
            new_path = TagPath(
                ancestor=None,
                descendant=tag,
                pathlength=1,
            )
            new_path.save()
            return ("Created.", 0)
        else:
            tag = Tag(name=name, description=description)
            tag.save()
            tag_father = Tag.objects.get(name=father)
            ancestors = list(
                TagPath.objects.filter(descendant=tag_father).values(
                    "ancestor", "pathlength"
                )
            )
            if len(ancestors) == 0:
                return ("Father not found", 2)
            new_path = TagPath(
                ancestor=tag_father,
                descendant=tag,
                pathlength=1,
            )
            new_path.save()
            for a in ancestors:
                if a["ancestor"] is not None:
                    this_a_tag = Tag.objects.get(id=a["ancestor"])
                    new_path = TagPath(
                        ancestor=this_a_tag,
                        descendant=tag,
                        pathlength=a["pathlength"] + 1,
                    )
                    new_path.save()
            return ("Created.", 0)


def add_tag_str(tag_str):
    # add a list of tags like "/book/literature/poem"
    tag_str = tag_str.strip("/")
    tags = tag_str.split("/")
    father = None
    for t in tags:
        add_one_tag(t, "", father)
        father = t
    return 0


def get_descendants(tag):
    descendants_tag = TagPath.objects.filter(ancestor__id=tag["pk"])
    descendants = []
    for a in descendants_tag:
        if a.ancestor is not None:
            descendants.append(
                {"name": a.descendant.name, "pk": a.descendant.pk}
            )
    return descendants


def get_children(tag):
    if tag is None:
        children_tag = TagPath.objects.filter(ancestor=None, pathlength=1)
    else:
        children_tag = TagPath.objects.filter(ancestor=tag, pathlength=1)
    children = []
    for c in children_tag:
        children.append({"name": c.descendant.name, "pk": c.descendant.pk})
    return children


def merge_tags(tags, new_t):
    ret = []
    for t in tags:
        if not TagPath.objects.filter(
            ancestor__id=t["pk"], descendant__id=new_t
        ).exists():
            ret.append(t)
    this_tag = {"name": Tag.objects.get(id=new_t).name, "pk": new_t}
    ret.append(this_tag)
    return ret
