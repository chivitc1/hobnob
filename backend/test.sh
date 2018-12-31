x=$1
y=$2
z="$1:$2"
echo "params"

function check() {
  if [ -z $x ]; then
    z="default"
  fi
}

check
echo $z
